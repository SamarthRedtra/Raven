"""Set the default notification mode to mentions only for existing Raven members."""

import frappe


def execute():
	from raven.notification import unsubscribe_user_to_topic

	members = frappe.get_all(
		"Raven Channel Member",
		fields=["name", "channel_id", "user_id", "notification_preference"],
	)

	for member in members:
		if member.notification_preference != "Mentions Only":
			frappe.db.set_value(
				"Raven Channel Member",
				member.name,
				"notification_preference",
				"Mentions Only",
				update_modified=False,
			)
		# Mention-only members must not remain subscribed to the channel-wide
		# topic, otherwise they would still receive every message.
		unsubscribe_user_to_topic(member.channel_id, member.user_id)
