import Cookies from "js-cookie";

const API_ROOT = import.meta.env.VITE_BACKEND_URL || "http://localhost:1700";

function getTokenHeader() {
    return { token: Cookies.get("token") || "" };
}

export default class AppointmentService {
    constructor(base = API_ROOT) {
        this.base = base;
        this.eventName = "appointments-event";
    }

    dispatch(type, payload = null) {
        const evt = new CustomEvent(this.eventName, {
            detail: { type, payload },
        });
        window.dispatchEvent(evt);
    }

    // ----------------------------------------
    // PATIENT — FETCH THEIR APPOINTMENTS
    // ----------------------------------------
    async fetchDashboardRequests() {
        try {
            const res = await fetch(
                `${this.base}/api/appointments/my-appointments`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...getTokenHeader(),
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                this.dispatch("dashboard-loaded", data.appointments);
                return data.appointments;
            }

            this.dispatch("error", data.message);
            return null;
        } catch (err) {
            this.dispatch("error", err.message);
            return null;
        }
    }

    // ----------------------------------------
    // GET ALL DOCTORS
    // ----------------------------------------
    async fetchDoctors() {
        try {
            const res = await fetch(`${this.base}/api/doctors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...getTokenHeader(),
                },
            });

            const data = await res.json();

            if (data.success) {
                this.dispatch("doctors-loaded", data.doctors);
                return data.doctors;
            }

            this.dispatch("error", data.message);
            return null;
        } catch (err) {
            this.dispatch("error", err.message);
            return null;
        }
    }

    // ----------------------------------------
    // GET DOCTOR BY ID
    // ----------------------------------------
    async getDoctorById(id) {
        try {
            const res = await fetch(`${this.base}/api/doctors/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...getTokenHeader(),
                },
            });

            const data = await res.json();

            if (data.success) return data.doctor;

            throw new Error(data.message);
        } catch (err) {
            throw err;
        }
    }

    // ----------------------------------------
    // BOOK APPOINTMENT
    // ----------------------------------------
    async bookAppointment(payload) {
        try {
            const res = await fetch(`${this.base}/api/appointments/book`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getTokenHeader(),
                },
                body: JSON.stringify(payload), // REMOVED .trim()
            });

            const data = await res.json();

            if (data.success) {
                this.dispatch("appointment-booked", data.appointment);
                return data.appointment;
            }

            this.dispatch("error", data.message);
            return null;
        } catch (err) {
            console.error("Booking error:", err);
            this.dispatch("error", err.message);
            return null;
        }
    }

    // ----------------------------------------
    // CANCEL APPOINTMENT
    // ----------------------------------------
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
                this.dispatch("appointment-cancelled", appointmentId);
                return true;
            }

            this.dispatch("error", data.message);
            return false;
        } catch (err) {
            this.dispatch("error", err.message);
            return false;
        }
    }
}
