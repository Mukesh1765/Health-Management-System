// src/pages/DoctorDashboard.jsx
import { useEffect, useRef, useState } from "react";
import DoctorService from "../assets/DoctorService";
import "../styles/doctor-dashboard.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DoctorHeader from "../components/DoctorHeader";

export default function DoctorDashboard() {
    const svcRef = useRef(new DoctorService());
    const [stats, setStats] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
        pending: 0,
        completed: 0,
    });

    const [todayList, setTodayList] = useState([]);
    const [upcomingList, setUpcomingList] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const svc = svcRef.current;

        const listener = (e) => {
            const { type, payload } = e.detail;

            if (type === "dashboard-loaded") {
                const appts = payload.appointments || [];

                const now = new Date();
                const start = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate()
                );
                const end = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() + 1
                );

                const todayAppts = appts.filter(
                    (a) =>
                        new Date(a.appointmentDate) >= start &&
                        new Date(a.appointmentDate) < end
                );

                const upcomingAppts = appts.filter(
                    (a) => new Date(a.appointmentDate) >= end
                );

                const pending = appts.filter(
                    (a) => a.status === "pending" || a.status === "confirmed"
                ).length;

                const completed = appts.filter(
                    (a) => a.status === "completed"
                ).length;

                setStats({
                    totalAppointments: appts.length,
                    todayAppointments: todayAppts.length,
                    pending,
                    completed,
                });

                setTodayList(todayAppts);
                setUpcomingList(upcomingAppts);
                setLoading(false);
            }

            if (type === "error") {
                toast.error(payload);
                setLoading(false);
            }
        };

        window.addEventListener("doctor-event", listener);
        svc.fetchDashboardData();

        return () => window.removeEventListener("doctor-event", listener);
    }, []);

    return (
        <div className="doctor-dashboard-page">
            <DoctorHeader />

            <div className="doctor-dashboard-container">
                {/* ======= OVERVIEW BOX ======= */}
                <div className="dd-card dd-stats-card">
                    <h2 className="dd-card-title">Overview</h2>

                    <div className="dd-stats-grid">
                        <div className="dd-stat">
                            <div className="dd-stat-label">Total</div>
                            <div className="dd-stat-value">
                                {stats.totalAppointments}
                            </div>
                        </div>

                        <div className="dd-stat">
                            <div className="dd-stat-label">Today</div>
                            <div className="dd-stat-value">
                                {stats.todayAppointments}
                            </div>
                        </div>

                        <div className="dd-stat">
                            <div className="dd-stat-label">Pending</div>
                            <div className="dd-stat-value">{stats.pending}</div>
                        </div>

                        <div className="dd-stat">
                            <div className="dd-stat-label">Completed</div>
                            <div className="dd-stat-value">
                                {stats.completed}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ======= TODAY’S APPOINTMENTS ======= */}
                <div className="dd-card">
                    <div className="dd-card-head">
                        <h2 className="dd-card-title">Today's Appointments</h2>
                        <button
                            className="dd-view-btn"
                            onClick={() => navigate("/doctor/appointments")}
                        >
                            View All
                        </button>
                    </div>

                    <div className="dd-list">
                        {loading ? (
                            <div className="dd-empty">Loading...</div>
                        ) : todayList.length === 0 ? (
                            <div className="dd-empty">
                                No appointments today
                            </div>
                        ) : (
                            todayList.map((a) => (
                                <div
                                    key={a._id}
                                    className="dd-row"
                                    onClick={() =>
                                        navigate(
                                            `/doctor/appointments/${a._id}`
                                        )
                                    }
                                >
                                    <div>
                                        <div className="dd-name">
                                            {a.patient?.name || "Unknown"}
                                        </div>
                                        <div className="dd-meta">
                                            {new Date(
                                                a.appointmentDate
                                            ).toLocaleString()}{" "}
                                            • {a.slot}
                                        </div>
                                    </div>

                                    <span className={`dd-status ${a.status}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ======= UPCOMING ======= */}
                <div className="dd-card">
                    <h2 className="dd-card-title">Upcoming</h2>

                    <div className="dd-list">
                        {loading ? (
                            <div className="dd-empty">Loading...</div>
                        ) : upcomingList.length === 0 ? (
                            <div className="dd-empty">
                                No upcoming appointments
                            </div>
                        ) : (
                            upcomingList.slice(0, 6).map((a) => (
                                <div
                                    key={a._id}
                                    className="dd-row"
                                    onClick={() =>
                                        navigate(
                                            `/doctor/appointments/${a._id}`
                                        )
                                    }
                                >
                                    <div>
                                        <div className="dd-name">
                                            {a.patient?.name}
                                        </div>
                                        <div className="dd-meta">
                                            {new Date(
                                                a.appointmentDate
                                            ).toLocaleString()}{" "}
                                            • {a.slot}
                                        </div>
                                    </div>

                                    <span className={`dd-status ${a.status}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
