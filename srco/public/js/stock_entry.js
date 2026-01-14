// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt

frappe.ui.form.on("Stock Entry", {
    refresh(frm) {

        // Source Warehouse dropdown
        frm.fields_dict.items.grid.get_field("s_warehouse").get_query = function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            if (!row.item_code) {
                frappe.msgprint("Please select Item first");
                return;
            }

            return {
                query: "srco.api.warehouse.get_item_warehouses_with_qty",
                filters: {
                    item_code: row.item_code,
                    company: doc.company
                }
            };
        };

        // Target Warehouse dropdown
        frm.fields_dict.items.grid.get_field("t_warehouse").get_query = function (doc, cdt, cdn) {
            let row = locals[cdt][cdn];

            if (!row.item_code) {
                frappe.msgprint("Please select Item first");
                return;
            }

            return {
                query: "srco.api.warehouse.get_item_warehouses_with_qty",
                filters: {
                    item_code: row.item_code,
                    company: doc.company
                }
            };
        };
    }
});


// Child table events
// frappe.ui.form.on("Stock Entry Detail", {
//     item_code(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         // Clear warehouses when item changes
//         frappe.model.set_value(cdt, cdn, "s_warehouse", "");
//         frappe.model.set_value(cdt, cdn, "t_warehouse", "");

//         if (row.item_code) {
//             frappe.show_alert({
//                 message: __("Now select Source and Target Warehouse"),
//                 indicator: "green"
//             });
//         }
//     }
// });
