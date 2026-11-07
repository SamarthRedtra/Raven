# Copyright (c) 2026, The Commit Company and contributors
# License: AGPLv3

import frappe
from frappe.model.document import Document


class RavenMessageReminder(Document):
	def before_insert(self):
		if not self.user:
			self.user = frappe.session.user
