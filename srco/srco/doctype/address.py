# Copyright (c) 2026, Hidayatali and contributors
# For license information, please see license.txt

import frappe

def validate(doc, method):

    links = doc.get("links") or []
    branch_links = []

    for row in links:
        if row.link_doctype == "Branch" and row.link_name:
            branch_links.append(row.link_name.strip())

    # Allow only ONE branch in Address
    if len(branch_links) > 1:
        frappe.throw("Only one Branch is allowed per Address")

    # If no branch selected, skip
    if not branch_links:
        return

    branch = branch_links[0]

    # Check if this Branch already has another Address
    existing = frappe.db.get_all(
        "Dynamic Link",
        filters={
            "link_doctype": "Branch",
            "link_name": branch,
            "parenttype": "Address",
        },
        fields=["parent"]
    )

    for row in existing:
        # Ignore same Address while editing
        if row.parent != doc.name:
            frappe.throw(
                f"Branch <b>{branch}</b> already has an Address: <b>{row.parent}</b>",
                title="Branch Already Has Address"
            )

