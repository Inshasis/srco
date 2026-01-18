# Copyright (c) 2026, Hidayatali and contributors
# For license information, please see license.txt


import frappe

@frappe.whitelist()
def get_branch_address(branch):
    address = frappe.db.sql("""
        SELECT parent
        FROM `tabDynamic Link`
        WHERE link_doctype = 'Branch'
        AND link_name = %s
        AND parenttype = 'Address'
        LIMIT 1
    """, (branch,), as_dict=True)

    if address:
        return address[0].parent

    return None


@frappe.whitelist()
def update_branch_address(branch, address, google_map_link=None):
    doc = frappe.get_doc("Branch", branch)

    doc.custom_address = address

    if google_map_link:
        doc.custom_google_map_link = google_map_link

    doc.save(ignore_permissions=True)
    frappe.db.commit()

# import frappe

# @frappe.whitelist()
# def create_or_open_address(branch):
#     # Check existing address linked with Branch
#     address = frappe.db.sql("""
#         SELECT parent
#         FROM `tabDynamic Link`
#         WHERE link_doctype='Branch'
#         AND link_name=%s
#         AND parenttype='Address'
#         LIMIT 1
#     """, (branch,), as_dict=True)

#     # If found → open existing address
#     if address:
#         return address[0].parent

#     # Else create new Address
#     doc = frappe.new_doc("Address")
#     doc.address_title = branch
#     doc.address_type = "Billing"

#     # Dynamic Link
#     doc.append("links", {
#         "link_doctype": "Branch",
#         "link_name": branch
#     })

#     doc.insert(ignore_permissions=True)
#     frappe.db.commit()

#     return doc.name
