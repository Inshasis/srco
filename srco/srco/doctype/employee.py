# # Copyright (c) 2026, Hidayatali and contributors
# # For license information, please see license.txt

import frappe
from frappe import _
import traceback
from datetime import datetime


@frappe.whitelist()
def age_calculation(doc, method=None):
    if doc.date_of_birth:
        try:
            dob = datetime.strptime(doc.date_of_birth, "%Y-%m-%d").date()
            today = datetime.today().date()

            # Calculate years
            years = today.year - dob.year
            months = today.month - dob.month

            # Adjust if birthday not reached this year
            if today.day < dob.day:
                months -= 1

            if months < 0:
                years -= 1
                months += 12

            age_string = f"{years}Y {months}M"

            # Save age only if changed
            if doc.custom_age != age_string:
                doc.db_set("custom_age", age_string, update_modified=False)

        except Exception:
            frappe.log_error(traceback.format_exc(), "Age Calculation Error")


@frappe.whitelist()
def experince_calculation(doc, method=None):
    if doc.date_of_joining:
        try:
            exp = datetime.strptime(doc.date_of_joining, "%Y-%m-%d").date()
            today = datetime.today().date()

            # Calculate years
            years = today.year - exp.year
            months = today.month - exp.month

            # Adjust if birthday not reached this year
            if today.day < exp.day:
                months -= 1

            if months < 0:
                years -= 1
                months += 12

            exp_string = f"{years}Y {months}M"

            # Save age only if changed
            if doc.custom_experience != exp_string:
                doc.db_set("custom_experience", exp_string, update_modified=False)

        except Exception:
            frappe.log_error(traceback.format_exc(), "Age Calculation Error")