// src/pages/DoctorAppointments.jsx
import { useEffect, useRef, useState } from "react";
import DoctorService from "../assets/DoctorService";
import "../styles/doctor-appointments.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, ArrowLeft } from "lucide-react";

export default function DoctorAppointments() {
    const svcRef = useRef(new DoctorService());
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeTab, setActiveTab] = useState("today");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [triggerRefresh, setTriggerRefresh] = useState(0);

    /** -------------------------------
     *  DATE RANGE FOR TODAY
     * ------------------------------- */
    const rangeForToday = () => {
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
        return { start, end };
    };

    /** -------------------------------
     *  APPLY TABS + SEARCH
     * ------------------------------- */
    const applyFilter = (list, tab, q) => {
        if (!Array.isArray(list)) return [];

        let result = list.slice();
        const { start, end } = rangeForToday();

        switch (tab) {
            case "today":
                result = result.filter((a) => {
                    const dt = new Date(a.appointmentDate);
                    return dt >= start && dt < end;
                });
                break;

            case "pending":
                result = result.filter(
                    (a) => a.status === "pending" || a.status === "confirmed"
                );
                break;

            case "upcoming":
                result = result.filter(
                    (a) => new Date(a.appointmentDate) >= end
                );
                break;

            case "completed":
                result = result.filter((a) => a.status === "completed");
                break;

            case "cancelled":
                result = result.filter((a) => a.status === "cancelled");
                break;
        }

        if (q.trim() !== "") {
            const s = q.toLowerCase();

            result = result.filter((a) => {
                const n = a.patient?.name?.toLowerCase() || "";
                const r = (a.reason || a.symptoms || "").toLowerCase();
                return n.includes(s) || r.includes(s);
            });
        }

        result.sort(
            (x, y) => new Date(x.appointmentDate) - new Date(y.appointmentDate)
        );

        return result;
    };

    /** -------------------------------
     *  LOAD DATA + EVENTS
     * ------------------------------- */
    useEffect(() => {
        const svc = svcRef.current;

        const listener = (e) => {
            const { type, payload } = e.detail;

            if (type === "dashboard-loaded") {
                setAppointments(payload.appointments || []);
                setLoading(false);
            }

            if (type === "status-updated" || type === "prescription-added") {
                setAppointments((prev) =>
                    prev.map((p) => (p._id === payload._id ? payload : p))
                );
                toast.success(
                    type === "status-updated"
                        ? "Status updated"
                        : "Prescription saved"
                );
            }

            if (type === "refresh-appointments") {
                svc.fetchDashboardData();
            }

            if (type === "error") toast.error(payload);
        };

        window.addEventListener("doctor-event", listener);
        svc.fetchDashboardData();

        return () => window.removeEventListener("doctor-event", listener);
    }, []);

    /** -------------------------------
     *  FOR ONLINE/OFFLINE UI UPDATES
     * ------------------------------- */
    useEffect(() => {
        const listener = () => setTriggerRefresh((v) => v + 1);
        window.addEventListener("presence-event", listener);
        return () => window.removeEventListener("presence-event", listener);
    }, []);

    /** -------------------------------
     *  UPDATE FILTERS WHEN DATA CHANGES
     * ------------------------------- */
    useEffect(() => {
        setFiltered(applyFilter(appointments, activeTab, search));
    }, [appointments, activeTab, search, triggerRefresh]);

    /** -------------------------------
     *  DOCTOR ACTIONS
     * ------------------------------- */
    const changeStatus = async (id, status) => {
        setLoading(true);
        await svcRef.current.updateStatus(id, status);
        setLoading(false);
    };

    const openAppointment = (id) => navigate(`/doctor/appointments/${id}`);

    /** -------------------------------
     *  RENDER APPOINTMENT ROWS
     * ------------------------------- */
    const renderTable = () => (
        <table className="appt-table">
            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {filtered.map((a) => {
                    const patient = a.patient || {};
                    return (
                        <tr key={a._id}>
                            <td>{patient.name || "—"}</td>
                            <td>
                                {new Date(a.appointmentDate).toLocaleString()}
                            </td>
                            <td>{a.slot || "—"}</td>
                            <td>{a.reason || a.symptoms || "Not specified"}</td>
                            <td>
                                <span className={`status-badge ${a.status}`}>
                                    {a.status}
                                </span>
                            </td>

                            <td>
                                {a.status !== "completed" &&
                                    a.status !== "cancelled" && (
                                        <>
                                            <button
                                                className="btn small"
                                                onClick={() =>
                                                    changeStatus(
                                                        a._id,
                                                        "confirmed"
                                                    )
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn small outline"
                                                onClick={() =>
                                                    changeStatus(
                                                        a._id,
                                                        "completed"
                                                    )
                                                }
                                            >
                                                Complete
                                            </button>
                                        </>
                                    )}

                                <button
                                    className="btn small secondary"
                                    onClick={() => openAppointment(a._id)}
                                >
                                    Open
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return (
        <div className="doctor-appointments-page">
            <div className="topbar">
                <button className="back" onClick={() => navigate("/doctor")}>
                    <ArrowLeft size={16} /> Back
                </button>

                <h1>Appointments</h1>

                <div className="search-wrap">
                    <Search size={16} />
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="tabs">
                {["today", "pending", "upcoming", "completed", "cancelled"].map(
                    (t) => (
                        <button
                            key={t}
                            className={`tab ${activeTab === t ? "active" : ""}`}
                            onClick={() => setActiveTab(t)}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    )
                )}
            </div>

            <div className="content-area">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="empty">No appointments</div>
                ) : (
                    <div className="table-wrap">{renderTable()}</div>
                )}
            </div>
        </div>
    );
}
