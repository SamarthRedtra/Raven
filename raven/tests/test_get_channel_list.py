import frappe
from frappe.tests import IntegrationTestCase

from raven.api.raven_channel import get_channel_list

EXTRA_TEST_RECORD_DEPENDENCIES = ["User", "Raven User", "Raven Workspace", "Raven Workspace Member"]


class TestGetChannelList(IntegrationTestCase):
	def setUp(self):
		frappe.set_user("Administrator")

	def tearDown(self):
		frappe.db.rollback()
		frappe.set_user("Administrator")
		frappe.clear_cache()

	def test_no_duplicate_rows_with_duplicate_workspace_members(self):
		"""Duplicate Raven Workspace Member rows must not duplicate channels in get_channel_list."""
		workspace = frappe.get_doc(
			{
				"doctype": "Raven Workspace",
				"workspace_name": "Dedupe Test WS",
				"type": "Public",
			}
		).insert()

		test_user = "test1@example.com"
		frappe.get_doc("User", test_user).add_roles("Raven User")

		for _ in range(2):
			frappe.get_doc(
				{
					"doctype": "Raven Workspace Member",
					"workspace": workspace.name,
					"user": test_user,
					"is_admin": 0,
				}
			).insert(ignore_permissions=True)

		channel = frappe.get_doc(
			{
				"doctype": "Raven Channel",
				"channel_name": "dedupe-test-channel",
				"type": "Open",
				"workspace": workspace.name,
			}
		).insert()

		frappe.set_user(test_user)
		rows = get_channel_list(hide_archived=False)
		names = [r["name"] for r in rows if r["name"] == channel.name]

		self.assertEqual(len(names), 1, "Each channel should appear once in the list")
