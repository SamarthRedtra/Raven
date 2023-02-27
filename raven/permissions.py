import frappe

def channel_has_permission(doc, user=None, permission_type=None):

    # Write permission is only allowed to the owner of the channel
    if permission_type == "write":
        if doc.owner == user:
            return True
        else:
            return False
    else:
        if doc.type == "Open" or doc.type == "Public":
            return True
        elif doc.type == "Private":
            if doc.owner == user:
                return True
            elif frappe.db.exists("Raven Channel Member", {"channel_id": doc.name, "user_id": user}):
                return True
            else:
                return False

def channel_member_has_permission(doc, user=None, permission_type=None):

    # Allow self to modify their own channel member document
    if doc.user_id == user:
        return True
    
    channel_type = frappe.db.get_value("Raven Channel", doc.channel_id, "type")

    if channel_type == "Open" or channel_type == "Public":
        return True
    
    if channel_type == "Private":
        #If it's a private channel, only the members can modify the channel member
        if frappe.db.exists("Raven Channel Member", {"channel_id": doc.channel_id, "user_id": user}):
            return True
        else:
            return False

def message_has_permission(doc, user=None, permission_type=None):
    # Allow self to modify their own channel member document
    if doc.owner == user:
        return True
    
    channel_type = frappe.db.get_value("Raven Channel", doc.channel_id, "type")

    if channel_type == "Open" or channel_type == "Public":
        return True
    
    if channel_type == "Private":
        #If it's a private channel, only the members can modify the channel member
        if frappe.db.exists("Raven Channel Member", {"channel_id": doc.channel_id, "user_id": user}):
            return True
        else:
            return False