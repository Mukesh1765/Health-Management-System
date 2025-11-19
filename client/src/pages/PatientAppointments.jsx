import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentService from "../assets/AppointmentService";
import "../styles/patient-appointments.css";
import toast from "react-hot-toast";
import { ArrowLeft, Search } from "lucide-react";

export default function PatientAppointments() {
    const svcRef = useRef(new AppointmentService());
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeTab, setActiveTab] = useState("upcoming");
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [showAvailableToday, setShowAvailableToday] = useState(false);

    // trigger used to re-render list when presence or remote changes occur
    const [triggerRefresh, setTriggerRefresh] = useState(0);

    // -------------------------------
    // helper: is appointment strictly in future
    // -------------------------------
    const isFuture = (appt) => {
        try {
            const dt = new Date(appt.appointmentDate);
            return dt.getTime() > Date.now();
        } catch {
            return false;
        }
    };

    // -------------------------------
    // filtering logic
    // -------------------------------
    const applyFilter = (list, tab, q, onlyAvailable) => {
        if (!Array.isArray(list)) return [];

        let result = [];

        switch (tab) {
            case "pending":
                result = list.filter((a) => a.status === "pending");
                break;

            case "completed":
                result = list.filter((a) => a.status === "completed");
                break;

            case "cancelled":
                result = list.filter((a) => a.status === "cancelled");
                break;

            case "upcoming":
            default:
                // upcoming = approved OR any future (not cancelled/completed)
                result = list.filter(
                    (a) =>
                        a.status === "approved" ||
                        (isFuture(a) &&
                            a.status !== "cancelled" &&
                            a.status !== "completed")
                );
                // sort by nearest date ascending
                result.sort(
                    (x, y) =>
                        new Date(x.appointmentDate) -
                        new Date(y.appointmentDate)
                );
                break;
        }

        // search by doctor name or specialization
        if (q && q.trim() !== "") {
            const qq = q.trim().toLowerCase();
            result = result.filter((a) => {
                const name = a.doctor?.name?.toLowerCase() || "";
                const spec = a.doctor?.specialization?.toLowerCase() || "";
                return name.includes(qq) || spec.includes(qq);
            });
        }

        // available today filter: doctor's availableSlots array has items
        if (onlyAvailable) {
            result = result.filter(
                (a) =>
                    Array.isArray(a.doctor?.availableSlots) &&
                    a.doctor.availableSlots.length > 0
            );
        }

        return result;
    };

    // -------------------------------
    // main event listener + initial fetch
    // -------------------------------
    useEffect(() => {
        const svc = svcRef.current;

        const listener = (e) => {
            const { type, payload } = e.detail;

            if (type === "dashboard-loaded") {
                setAppointments(payload || []);
                setLoading(false);
            }

            if (type === "appointment-cancelled") {
                // update single appointment status locally
                setAppointments((prev) =>
                    prev.map((a) =>
                        a._id === payload ? { ...a, status: "cancelled" } : a
                    )
                );
                toast.success("Appointment cancelled");
            }

            if (type === "refresh-appointments") {
                // backend or other UI triggered a refresh - re-fetch list
                svc.fetchDashboardRequests();
            }

            if (type === "error") {
                toast.error(payload || "Error loading appointments");
                setLoading(false);
            }
        };

        window.addEventListener("appointments-event", listener);

        setLoading(true);
        svc.fetchDashboardRequests();

        return () => window.removeEventListener("appointments-event", listener);
    }, []);

    // -------------------------------
    // presence-event listener to cause re-render when online/offline changes
    // presence events should be dispatched by your presence hook/service:
    // window.dispatchEvent(new CustomEvent('presence-event'));
    // -------------------------------
    useEffect(() => {
        const onPresence = () => {
            setTriggerRefresh((v) => v + 1);
        };

        window.addEventListener("presence-event", onPresence);

        return () => window.removeEventListener("presence-event", onPresence);
    }, []);

    // -------------------------------
    // reapply filters whenever inputs change
    // -------------------------------
    useEffect(() => {
        const next = applyFilter(
            appointments,
            activeTab,
            search,
            showAvailableToday
        );
        setFiltered(next);
    }, [appointments, activeTab, search, showAvailableToday, triggerRefresh]);

    // -------------------------------
    // cancel appointment
    // -------------------------------
    const handleCancel = async (id) => {
        try {
            await svcRef.current.cancelAppointment(id);
            // AppointmentService is expected to dispatch "appointment-cancelled" or "refresh-appointments"
        } catch (err) {
            toast.error(err?.message || "Cancel failed");
        }
    };

    // -------------------------------
    // render single appointment card
    // -------------------------------
    const renderCard = (appt) => {
        const doctor = appt.doctor || {};
        const online = doctor.isActive === true; // explicit boolean check to trigger rerender correctly
        const apptDate = appt.appointmentDate
            ? new Date(appt.appointmentDate).toLocaleDateString()
            : "—";

        return (
            <div key={appt._id} className="appt-card">
                <div className="left-block">
                    <div className="photo-spot-sm" aria-hidden="true" />
                    <div className="info-block">
                        <div className="title-row">
                            <h3 className="doctor-name">
                                {doctor.name || "Doctor"}
                            </h3>
                            <div
                                className={`online-dot ${
                                    online ? "online" : "offline"
                                }`}
                                title={online ? "Online" : "Offline"}
                            />
                        </div>

                        <p className="spec">
                            {doctor.specialization || "General"}
                        </p>

                        <p className="dt">
                            {apptDate} — {appt.slot || "—"}
                        </p>

                        <p className="reason">
                            <strong>Reason:</strong>{" "}
                            {appt.reason?.trim() || "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="right-block">
                    <span className={`status-tag ${appt.status}`}>
                        {appt.status}
                    </span>

                    {appt.status === "pending" && (
                        <button
                            className="cancel-btn"
                            onClick={() => handleCancel(appt._id)}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // -------------------------------
    // UI
    // -------------------------------
    return (
        <div className="appointments-page">
            <div className="appt-top-row">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} />
                    Back
                </button>

                <h1 className="page-heading">Your Appointments</h1>

                <button
                    className="book-new-btn"
                    onClick={() => navigate("/role/appointments/doctors")}
                >
                    + New Appointment
                </button>
            </div>

            <div className="appt-filter-bar">
                <div className="search-box" role="search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by doctor or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    className={`available-btn ${
                        showAvailableToday ? "active" : ""
                    }`}
                    onClick={() => setShowAvailableToday((old) => !old)}
                    aria-pressed={showAvailableToday}
                >
                    Available Today
                </button>
            </div>

            <div
                className="appt-tabs"
                role="tablist"
                aria-label="Appointment tabs"
            >
                {["upcoming", "pending", "completed", "cancelled"].map((t) => (
                    <button
                        key={t}
                        className={`tab-btn ${activeTab === t ? "active" : ""}`}
                        onClick={() => setActiveTab(t)}
                        role="tab"
                        aria-selected={activeTab === t}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            <div className="appointment-list">
                {loading ? (
                    <div className="loading-screen">
                        <div className="spinner" />
                        <p>Loading appointments...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <p>No {activeTab} appointments</p>
                        <button
                            className="empty-book-btn"
                            onClick={() =>
                                navigate("/role/appointments/doctors")
                            }
                        >
                            Book Appointment
                        </button>
                    </div>
                ) : (
                    filtered.map((appt) => renderCard(appt))
                )}
            </div>
        </div>
    );
}
