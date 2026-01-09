// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt

frappe.ui.form.on("Address", {
    refresh(frm) {
        set_cascading_queries(frm);
        toggle_google_map_button(frm);
    },

    custom_province(frm) {
        frm.set_value("custom_citys", null);
        frm.set_value("custom_area", null);
        
        set_cascading_queries(frm);
        update_full_address(frm);
    },

    custom_citys(frm) {
        frm.set_value("custom_area", null);
        
        set_cascading_queries(frm);
        update_full_address(frm);
    },

    custom_area(frm) {
        update_full_address(frm);
    },

    custom_address_line(frm) {
        update_full_address(frm);
    },

    custom_google_map_link(frm) {
        toggle_google_map_button(frm);
    },

    validate(frm) {
        update_full_address(frm);
    }
});

function set_cascading_queries(frm) {
    // City filtered by Province (standard field: "province")
    frm.set_query("custom_citys", function(doc) {
        return {
            filters: {
                "province": doc.custom_province || "N/A"
            }
        };
    });

    // Area filtered by City (standard field: "city" – changed from "parent_city")
    frm.set_query("custom_area", function(doc) {
        return {
            filters: {
                "city": doc.custom_citys || "N/A"
            }
        };
    });
}

function update_full_address(frm) {
    if (frm.doc.custom_province && frm.doc.custom_citys && frm.doc.custom_area && frm.doc.custom_address_line) {
        const address = [
            frm.doc.custom_address_line,
            frm.doc.custom_area,
            frm.doc.custom_citys,
            frm.doc.custom_province
        ].join(", ");
        
        frm.set_value("custom_full_address", address);
        frm.refresh_field("custom_full_address");
        frm.set_value("address_line1", address);
        frm.set_value("city", frm.doc.custom_citys);
        frm.set_value("county", frm.doc.custom_area);
        frm.set_value("state", frm.doc.custom_province);
    }
}

function toggle_google_map_button(frm) {
    frm.set_df_property("custom_open_map", "hidden", frm.doc.custom_google_map_link ? 0 : 1);
}

frappe.ui.form.on("Address", "custom_open_map", function(frm) {
    if (frm.doc.custom_google_map_link) {
        window.open(frm.doc.custom_google_map_link);
    }
});