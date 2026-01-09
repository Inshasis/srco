// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt

frappe.ui.form.on("Block", {
    setup(frm) {
        frm.set_query("warehouse", function() {
            return {
                filters: {
                    is_group: 0
                }
            };
        });
    }
});
