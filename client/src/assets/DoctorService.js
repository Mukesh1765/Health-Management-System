// src/services/DoctorService.js
import Cookies from "js-cookie";

const API_ROOT = import.meta.env.VITE_BACKEND_URL || "http://localhost:1700";

function getTokenHeader() {
    const token = Cookies.get("token") || "";
    return { token };
}

export default class DoctorService {
    constructor(base = API_ROOT) {
        this.base = base;
        this.eventName = "doctor-event";
    }

    dispatch(type, payload = null) {
        const evt = new CustomEvent(this.eventName, {
            detail: { type, payload },
        });
        window.dispatchEvent(evt);
    }

    /** =============================
     *  FETCH DOCTOR DASHBOARD DATA
     *  ============================= */
    async fetchDashboardData() {
        try {
            const apptRes = await fetch(
                `${this.base}/api/appointments/doctor-appointments`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...getTokenHeader(),
                    },
                }
            );

            const apptData = await apptRes.json();
            if (!apptData.success) {
                throw new Error(apptData.message);
            }

            this.dispatch("dashboard-loaded", {
                appointments: apptData.appointments,
            });

            return apptData.appointments;
        } catch (err) {
            this.dispatch("error", err.message);
            return null;
        }
    }

    /** =============================
     *  UPDATE STATUS
     *  ============================= */
    async updateStatus(appointmentId, status) {
        try {
            const payload = { appointmentId, status };

            const res = await fetch(
                `${this.base}/api/appointments/update-status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        ...getTokenHeader(),
                    },
                    body: JSON.stringify(payload), // ❗ NO TRIM
                }
            );

            const data = await res.json();

            if (data.success) {
                this.dispatch("status-updated", data.appointment);
                this.dispatch("refresh-appointments");
                return data.appointment;
            } else {
                this.dispatch("error", data.message);
                return null;
            }
        } catch (err) {
            this.dispatch("error", err.message);
        }
    }

    /** =============================
     *  ADD PRESCRIPTION
     *  ============================= */
    async addPrescription(appointmentId, notes, prescriptionObject) {
        try {
            const payload = {
                appointmentId,
                notes,
                prescription: prescriptionObject, // send object, not string
            };

            const res = await fetch(
                `${this.base}/api/appointments/add-prescription`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        ...getTokenHeader(),
                    },
                    body: JSON.stringify(payload), // ❗ send clean JSON
                }
            );

            const data = await res.json();

            if (data.success) {
                this.dispatch("prescription-added", data.appointment);
                this.dispatch("refresh-appointments");
                return data.appointment;
            } else {
                this.dispatch("error", data.message);
                return null;
            }
        } catch (err) {
            this.dispatch("error", err.message);
        }
    }

    /** =============================
     *  CANCEL APPOINTMENT
     *  ============================= */
    async cancelAppointment(appointmentId) {
        try {
            const res = await fetch(`${this.base}/api/appointments/cancel`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...getTokenHeader(),
                },
                body: JSON.stringify({ appointmentId }),
            });

            const data = await res.json();

            if (data.success) {
                this.dispatch("appointment-cancelled", data.appointment);
                this.dispatch("refresh-appointments");
                return data.appointment;
            } else {
                this.dispatch("error", data.message);
                return null;
            }
        } catch (err) {
            this.dispatch("error", err.message);
            return null;
        }
    }
}
