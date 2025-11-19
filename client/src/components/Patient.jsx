// src/pages/PatientHome.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/patient.css";
import { useNavigate } from "react-router-dom";
import PatientHeader from "./PatientHeader";
import api from "../assets/utils";

export default function Patient() {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    // Load user appointments
    useEffect(() => {
        async function load() {
            try {
                const data = await api.get("/api/appointments/my-appointments");
                if (data.success) setAppointments(data.appointments);
            } catch (err) {
                console.log(err);
            }
        }
        load();
    }, []);

    // Compute upcoming appointments
    const upcoming = useMemo(() => {
        return appointments.filter((a) => {
            const d = new Date(a.appointmentDate);

            // invalid date safety
            if (d.toString() === "Invalid Date") return false;

            // future or today
            const isFuture = d >= new Date();

            // allowed statuses
            const allowedStatus = ["pending", "confirmed"];

            return isFuture && allowedStatus.includes(a.status);
        });
    }, [appointments]);

    return (
        <div className="ph-page">
            <PatientHeader />

            <div className="ph-container">
                {/* Welcome Section */}
                <div className="ph-welcome">
                    <h1 className="ph-title">Welcome Back</h1>
                    <p className="ph-subtitle">
                        Manage your health and appointments
                    </p>
                </div>

                {/* Top Stats */}
                <div className="ph-stats">
                    <div className="ph-stat">
                        <div className="ph-stat-label">
                            Upcoming Appointments
                        </div>
                        <div className="ph-stat-value">
                            {upcoming.length || 0}
                        </div>
                    </div>

                    <div className="ph-stat">
                        <div className="ph-stat-label">Total Visits</div>
                        <div className="ph-stat-value">
                            {appointments.length || 0}
                        </div>
                    </div>

                    <div className="ph-stat">
                        <div className="ph-stat-label">Cart Items</div>
                        <div className="ph-stat-value">
                            {localStorage.getItem("med-cart-count") || 0}
                        </div>
                    </div>
                </div>

                {/* Action Blocks */}
                <div className="ph-actions">
                    <div className="ph-action-card">
                        <h3>Book Appointment</h3>
                        <p>Find and book appointments with top doctors</p>
                        <button onClick={() => navigate("/role/appointments")}>
                            Find Doctors
                        </button>
                    </div>

                    <div className="ph-action-card">
                        <h3>Order Medicines</h3>
                        <p>Browse medicines and place quick orders</p>
                        <button onClick={() => navigate("/medicines")}>
                            View Medicines
                        </button>
                    </div>

                    <div className="ph-action-card">
                        <h3>Go To Profile</h3>
                        <p>Edit your account details</p>
                        <button onClick={() => navigate("/role/profile")}>
                            View Profile
                        </button>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <h2 className="ph-section-title">Upcoming Appointments</h2>

                {upcoming.length === 0 ? (
                    <div className="ph-empty">No upcoming appointments</div>
                ) : (
                    <div className="ph-appointments-list">
                        {upcoming.map((a) => (
                            <div key={a._id} className="ph-appt-card">
                                <div className="ph-appt-left">
                                    <div className="ph-doc-photo"></div>
                                    <div>
                                        <div className="ph-doc-name">
                                            {a.doctor?.name || "Doctor"}
                                        </div>
                                        <div className="ph-doc-spec">
                                            {a.doctor?.specialization ||
                                                "Specialist"}
                                        </div>
                                    </div>
                                </div>

                                <div className="ph-appt-mid">
                                    <div className="ph-appt-date">
                                        {new Date(
                                            a.appointmentDate
                                        ).toLocaleDateString()}
                                    </div>
                                    <div className="ph-appt-time">{a.slot}</div>
                                </div>

                                <div className="ph-appt-right">
                                    {a.mode || "In-Person"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
