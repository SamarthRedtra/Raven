"""Remove mention-only members from channel-wide push topics."""

import frappe


def execute():
	from raven.notification import unsubscribe_user_to_topic

	for member in frappe.get_all(
		"Raven Channel Member",
		filters={"notification_preference": "Mentions Only"},
		fields=["channel_id", "user_id"],
	):
		unsubscribe_user_to_topic(member.channel_id, member.user_id)
