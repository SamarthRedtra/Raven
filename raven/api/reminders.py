# Copyright (c) 2026, The Commit Company and contributors
# License: AGPLv3

"""Personal reminders on Raven messages."""

from __future__ import annotations

import frappe
from frappe import _
from frappe.query_builder import Order
from frappe.utils import get_datetime, now_datetime, strip_html

from raven.notification import send_notification_to_user
from raven.utils import is_channel_member


@frappe.whitelist(methods=["POST"])
def create_reminder(message: str, remind_at: str) -> dict:
	row = frappe.db.get_value("Raven Message", message, ["name", "channel_id", "text"], as_dict=True)
	if not row:
		frappe.throw(_("Message not found"))
	if not is_channel_member(row.channel_id):
		frappe.throw(_("You are not a member of this channel"), frappe.PermissionError)
	when = get_datetime(remind_at)
	if when <= now_datetime():
		frappe.throw(_("Choose a reminder time in the future."))
	doc = frappe.get_doc(
		{
			"doctype": "Raven Message Reminder",
			"user": frappe.session.user,
			"message": row.name,
			"channel_id": row.channel_id,
			"remind_at": when,
		}
	)
	doc.insert(ignore_permissions=True)
	return {"name": doc.name, "remind_at": str(doc.remind_at)}


@frappe.whitelist()
def get_my_reminders() -> list[dict]:
	if not frappe.db.exists("DocType", "Raven Message Reminder"):
		return []

	reminder = frappe.qb.DocType("Raven Message Reminder")
	message = frappe.qb.DocType("Raven Message")
	channel = frappe.qb.DocType("Raven Channel")

	return (
		frappe.qb.from_(reminder)
		.select(
			reminder.name,
			reminder.message,
			reminder.channel_id,
			reminder.remind_at,
			message.text,
			message.message_type,
			message.owner,
			message.file,
			channel.channel_name,
			channel.type.as_("channel_type"),
			channel.workspace,
			channel.is_thread,
			channel.is_direct_message,
		)
		.left_join(message)
		.on(reminder.message == message.name)
		.left_join(channel)
		.on(reminder.channel_id == channel.name)
		.where(reminder.user == frappe.session.user)
		.where(reminder.is_sent == 0)
		.orderby(reminder.remind_at, order=Order.asc)
		.limit(50)
		.run(as_dict=True)
	)


@frappe.whitelist(methods=["POST"])
def cancel_reminder(name: str) -> dict:
	if not frappe.db.exists("Raven Message Reminder", name):
		frappe.throw(_("Reminder not found"))
	owner = frappe.db.get_value("Raven Message Reminder", name, "user")
	if owner != frappe.session.user:
		frappe.throw(_("You can only dismiss your own reminders"), frappe.PermissionError)
	frappe.delete_doc("Raven Message Reminder", name, ignore_permissions=True)
	return {"ok": True}


@frappe.whitelist()
def get_due_reminder_count() -> int:
	if not frappe.db.exists("DocType", "Raven Message Reminder"):
		return 0
	return frappe.db.count(
		"Raven Message Reminder",
		{"user": frappe.session.user, "is_sent": 0, "remind_at": ["<=", now_datetime()]},
	)


def dispatch_due_reminders():
	if not frappe.db.exists("DocType", "Raven Message Reminder"):
		return
	due = frappe.get_all(
		"Raven Message Reminder",
		filters={"is_sent": 0, "remind_at": ["<=", now_datetime()]},
		fields=["name", "user", "message", "channel_id"],
		limit=200,
	)
	for row in due:
		text = strip_html(frappe.db.get_value("Raven Message", row.message, "text") or "") or _("Message reminder")
		send_notification_to_user(
			row.user,
			_("Reminder"),
			text,
			data={"channel_id": row.channel_id, "message_id": row.message},
		)
		frappe.publish_realtime("raven_reminder", {"name": row.name}, user=row.user)
		frappe.db.set_value("Raven Message Reminder", row.name, "is_sent", 1, update_modified=False)
