// Copyright (c) 2026, Hidayatali and contributors
// For license information, please see license.txt


frappe.ui.form.on("Employee", {
    refresh(frm) {
        if (!frm.is_new() && !frm.doc.custom_age && !frm.doc.custom_experience) {
            frm.add_custom_button("Age & Experience Calculation", () => {

                const dob = frm.doc.date_of_birth;
                const doj = frm.doc.date_of_joining;

                if (!dob || !doj) {
                    frappe.msgprint("Please set Date of Birth and Date of Joining");
                    return;
                }

                // AGE calculation
                const ageDuration = moment.duration(moment().diff(moment(dob)));
                const ageYears = ageDuration.years();
                const ageMonths = ageDuration.months();
                const ageText = `${ageYears}Y ${ageMonths}M`;

                // EXPERIENCE calculation
                const expDuration = moment.duration(moment().diff(moment(doj)));
                const expYears = expDuration.years();
                const expMonths = expDuration.months();
                const expText = `${expYears}Y ${expMonths}M`;

                // Set values
                frm.set_value("custom_age", ageText);
                frm.set_value("custom_experience", expText);

                frm.save();
            });
        }
    }
});


