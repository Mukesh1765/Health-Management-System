// src/pages/BookAppointment.jsx
import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentService from "../assets/AppointmentService";
import "../styles/book.css";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const svcRef = useRef(new AppointmentService());
    const { authUser } = useContext(AuthContext);

    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);

    const [patientName, setPatientName] = useState("");
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [symptoms, setSymptoms] = useState("");

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const doc = await svcRef.current.getDoctorById(doctorId);
                setDoctor(doc);

                // fallback slots if backend doesn't provide availableSlots
                const defaultSlots = [
                    "09:00 AM",
                    "09:30 AM",
                    "10:00 AM",
                    "10:30 AM",
                    "11:00 AM",
                    "11:30 AM",
                    "02:00 PM",
                    "02:30 PM",
                    "03:00 PM",
                    "03:30 PM",
                    "04:00 PM",
                ];

                const backendSlots =
                    doc?.availableSlots && doc.availableSlots.length > 0
                        ? doc.availableSlots
                        : defaultSlots;

                setSlots(backendSlots);
                setPatientName(authUser?.name || "");
            } catch (err) {
                console.error(err);
                toast.error("Failed to load doctor details");
            }
        };
        if (doctorId) fetchDoctor();
    }, [doctorId, authUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !slot) {
            toast.error("Please select date and time slot");
            return;
        }

        // Build an ISO appointmentDate. If slot is e.g. "09:30 AM" we assume local timezone.
        const localDateTime = `${date} ${slot}`;
        const appointmentDate = new Date(localDateTime).toISOString();

        const payload = {
            doctorId,
            appointmentDate,
            slot,
            mode: "in-person",
            reason: symptoms,
            symptoms: symptoms ? symptoms.split(",").map((s) => s.trim()) : [],
            patientName,
        };

        try {
            const appt = await svcRef.current.bookAppointment(payload);

            if (appt) {
                toast.success("Appointment booked");
                navigate("/role/appointments");
                return;
            }

            toast.error("Booking failed — check details or try again");
        } catch (err) {
            console.error("book error", err);
            toast.error("Failed to book appointment");
        }
    };

    if (!doctor) return <div className="loading-screen">Loading doctor...</div>;

    return (
        <div className="page-center">
            <div className="container-wide">
                <div className="top-row">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <h1 className="page-title">Book Appointment</h1>
                </div>

                <div className="book-layout">
                    <div className="doctor-info">
                        <div className="photo-spot-lg"></div>

                        <div className="info-col">
                            <h2>{doctor.name}</h2>

                            <div className="special">
                                {doctor.specialization || "General Physician"}
                            </div>

                            <div className="stats-row">
                                <span>Rating: {doctor.rating ?? "—"}</span>
                                <span>
                                    {doctor.totalPatients ?? "—"} patients
                                </span>
                                <span>{doctor.experience ?? 0} yrs exp</span>
                            </div>

                            <div className="qual">
                                {doctor.qualification || ""}
                            </div>

                            <div className="fee-row">
                                <div className="fee">
                                    ₹{doctor.consultationFee ?? 0}
                                </div>

                                <div
                                    className={`available-tag ${
                                        slots.length ? "" : "muted"
                                    }`}
                                >
                                    {slots.length
                                        ? "Available Today"
                                        : "Not Available"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <form className="form-card" onSubmit={handleSubmit}>
                        <div className="form-section-title">
                            Patient Information
                        </div>

                        <label>Patient Name</label>
                        <input
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            required
                            placeholder="Enter patient name"
                        />

                        <div className="row">
                            <div>
                                <label>Appointment Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label>Time Slot</label>
                                <select
                                    value={slot}
                                    onChange={(e) => setSlot(e.target.value)}
                                    required
                                >
                                    <option value="">Select a slot</option>
                                    {slots.map((s, idx) => (
                                        <option key={idx} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <label>Symptoms / Reason</label>
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            rows={4}
                            placeholder="Describe symptoms"
                        ></textarea>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                Book Appointment
                            </button>

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
