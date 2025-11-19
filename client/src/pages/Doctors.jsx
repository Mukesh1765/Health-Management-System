import { useEffect, useRef, useState } from "react";
import AppointmentService from "../assets/AppointmentService";
import "../styles/doctors.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Doctors() {
    const svcRef = useRef(new AppointmentService());
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);
    const navigate = useNavigate();

    // Fetch doctors
    useEffect(() => {
        const svc = svcRef.current;

        const listener = (e) => {
            const { type, payload } = e.detail;
            if (type === "doctors-loaded") {
                setDoctors(payload);
                setFiltered(payload);
            }
            if (type === "error") toast.error(payload);
        };

        window.addEventListener("appointments-event", listener);
        svc.fetchDoctors();

        return () => window.removeEventListener("appointments-event", listener);
    }, []);

    // Filtering logic
    useEffect(() => {
        let list = [...doctors];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    (d.specialization || "").toLowerCase().includes(q)
            );
        }

        if (availableOnly) list = list.filter((d) => d.isActive);

        setFiltered(list);
    }, [search, availableOnly, doctors]);

    return (
        <div className="doctor-page">
            {/* Header */}
            <div className="top-row">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    Back
                </button>
                <h1>Find a Doctor</h1>
            </div>

            {/* Search + Filter */}
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />

                <label className="avail-filter">
                    <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(e) => setAvailableOnly(e.target.checked)}
                    />
                    Available Now
                </label>
            </div>

            {/* Doctor List */}
            <div className="doctor-grid">
                {filtered.length === 0 ? (
                    <p className="no-results">No doctors found.</p>
                ) : (
                    filtered.map((doc) => (
                        <div key={doc._id} className="doctor-card">
                            <div className="doc-left">
                                <div className="photo"></div>
                            </div>

                            <div className="doc-right">
                                <div className="row-between">
                                    <h2 className="doc-name">{doc.name}</h2>

                                    <span
                                        className={`dot ${
                                            doc.isActive ? "on" : "off"
                                        }`}
                                    ></span>
                                </div>

                                <p className="spec">
                                    {doc.specialization || "General"}
                                </p>
                                <p className="exp">
                                    {doc.experience || 0} yrs experience
                                </p>

                                <button
                                    className="book-btn"
                                    onClick={() =>
                                        navigate(
                                            `/role/appointments/book-appointment/${doc._id}`
                                        )
                                    }
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
