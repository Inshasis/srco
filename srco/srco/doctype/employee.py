# # Copyright (c) 2026, Hidayatali and contributors
# # For license information, please see license.txt

import frappe
import traceback
from frappe.utils import getdate, today


def calculate_years_months(from_date):
    from_date = getdate(from_date)
    to_date = getdate(today())

    years = to_date.year - from_date.year
    months = to_date.month - from_date.month

    if to_date.day < from_date.day:
        months -= 1

    if months < 0:
        years -= 1
        months += 12

    return f"{years}-{months}"


def set_age_and_experience(doc, method=None):
    try:
        if doc.date_of_birth:
            age = calculate_years_months(doc.date_of_birth)
            if doc.custom_age != age:
                doc.db_set("custom_age", age, update_modified=False)

        if doc.date_of_joining:
            exp = calculate_years_months(doc.date_of_joining)
            if doc.custom_experience != exp:
                doc.db_set("custom_experience", exp, update_modified=False)

    except Exception:
        frappe.log_error(traceback.format_exc(), "Employee Age/Experience Calculation Error")


# Monthly Scheduler
def monthly_update_employee_age_experience():
    try:
        employees = frappe.get_all(
            "Employee",
            filters={"status": "Active"},
            fields=["name", "date_of_birth", "date_of_joining"]
        )

        for emp in employees:
            updates = {}

            if emp.date_of_birth:
                updates["custom_age"] = calculate_years_months(emp.date_of_birth)

            if emp.date_of_joining:
                updates["custom_experience"] = calculate_years_months(emp.date_of_joining)

            if updates:
                frappe.db.set_value("Employee", emp.name, updates, update_modified=False)

        frappe.db.commit()

    except Exception:
        frappe.log_error(
            traceback.format_exc(),
            "Monthly Employee Age & Experience Scheduler Error"
        )