// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt


frappe.ui.form.on("Branch", {
    refresh(frm) {
        if (!frm.is_new()) {
            frm.add_custom_button("Address", () => {
                frappe.call({
                    method: "srco.api.branch.get_branch_address",
                    args: {
                        branch: frm.doc.name
                    },
                    callback(r) {
                        if (r.message) {
                            // Open existing Address
                            frappe.set_route("Form", "Address", r.message);
                        } else {
                            // Open new Address form
                            frappe.set_route("Form", "Address", "new-address");

                            // Wait until Address form is ready
                            let check_form = setInterval(() => {
                                if (cur_frm && cur_frm.doctype === "Address") {
                                    clearInterval(check_form);

                                    // Set basic fields
                                    cur_frm.set_value("address_title", frm.doc.branch || frm.doc.name);
                                    cur_frm.set_value("address_type", "Office");

                                    // Add Dynamic Link row properly
                                    let row = frappe.model.add_child(
                                        cur_frm.doc,
                                        "Dynamic Link",
                                        "links"
                                    );

                                    row.link_doctype = "Branch";
                                    row.link_name = frm.doc.name;

                                    cur_frm.refresh_field("links");
                                }
                            }, 300);
                        }
                    }
                });
            });
        }
    }
});
