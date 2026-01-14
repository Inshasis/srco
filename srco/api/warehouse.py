# Copyright (c) 2026, Hidayatali and contributors
# For license information, please see license.txt

import frappe

@frappe.whitelist()
def get_item_warehouses_with_qty(doctype=None, txt="", searchfield=None, start=0, page_len=20, filters=None):

    # Convert filters from string → dict
    if isinstance(filters, str):
        filters = frappe.parse_json(filters)

    if not filters:
        filters = {}

    item_code = filters.get("item_code")
    company = filters.get("company")

    if not item_code:
        return []

    return frappe.db.sql("""
        SELECT
            w.name AS value,
            CONCAT(
                'Actual Qty : ',
                FORMAT(IFNULL(b.actual_qty, 0), 2)
            ) AS label

        FROM `tabWarehouse` w
        LEFT JOIN `tabBin` b 
            ON b.warehouse = w.name 
            AND b.item_code = %s

        WHERE
            (%s IS NULL OR w.company = %s)
            AND w.name LIKE %s

        ORDER BY IFNULL(b.actual_qty, 0) DESC
        LIMIT %s OFFSET %s
    """, (
        item_code,
        company, company,
        f"%{txt}%",
        page_len,
        start
    ))





