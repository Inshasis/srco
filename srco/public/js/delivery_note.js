// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt

frappe.ui.form.on("Delivery Note", {
    refresh(frm) {
        set_child_block_filter(frm);
        set_child_shelf_filter(frm);
    }
});

// ===== When warehouse changes → reset block & shelf =====
frappe.ui.form.on("Delivery Note Item", {
    warehouse(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        // Clear dependent fields
        row.block = "";
        row.shelf = "";

        frm.refresh_field("items");
    },

    block(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        // Clear shelf when block changes
        row.shelf = "";

        frm.refresh_field("items");
    }
});


// ===== Block Filter based on Warehouse =====
function set_child_block_filter(frm) {
    frm.fields_dict["items"].grid.get_field("block").get_query = function(doc, cdt, cdn) {
        let row = locals[cdt][cdn];

        return {
            filters: {
                warehouse: row.warehouse || "N/A"
            }
        };
    };
}


// ===== Shelf Filter based on Block =====
function set_child_shelf_filter(frm) {
    frm.fields_dict["items"].grid.get_field("shelf").get_query = function(doc, cdt, cdn) {
        let row = locals[cdt][cdn];

        return {
            filters: {
                block: row.block || "N/A"
            }
        };
    };
}
