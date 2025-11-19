// src/pages/DoctorConsultation.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorService from "../assets/DoctorService";
import "../styles/doctor.css";
import toast from "react-hot-toast";

export default function DoctorConsultation() {
    const { id } = useParams();
    const svcRef = useRef(new DoctorService());
    const [appointment, setAppointment] = useState(null);
    const [notes, setNotes] = useState("");
    const [prescription, setPrescription] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // We will fetch doctor appointments and find matching id
        const svc = svcRef.current;
        const listener = (e) => {
            const { type, payload } = e.detail;
            if (type === "dashboard-loaded") {
                const appt = (payload.appointments || []).find(
                    (a) => a._id === id
                );
                if (appt) {
                    setAppointment(appt);
                    setNotes(appt.notes || "");
                    setPrescription(appt.prescription || "");
                } else {
                    // If not found, still show empty
                    setAppointment(null);
                }
                setLoading(false);
            }
            if (type === "prescription-added") {
                if (payload._id === id) {
                    setAppointment(payload);
                }
            }
            if (type === "error") {
                toast.error(payload);
                setLoading(false);
            }
        };

        window.addEventListener("doctor-event", listener);
        svc.fetchDashboardData();

        return () => window.removeEventListener("doctor-event", listener);
    }, [id]);

    const savePrescription = async () => {
        if (!appointment) return;
        const res = await svcRef.current.addPrescription(
            appointment._id,
            notes,
            prescription
        );
        if (res) {
            toast.success("Prescription saved");
            navigate("/doctor/appointments");
        }
    };

    const markComplete = async () => {
        if (!appointment) return;
        await svcRef.current.updateStatus(appointment._id, "completed");
        toast.success("Marked completed");
        navigate("/doctor/appointments");
    };

    if (loading) return <div className="doctor-page">Loading...</div>;

    if (!appointment)
        return <div className="doctor-page">Appointment not found</div>;

    return (
        <div className="doctor-page consult-page">
            <div className="consult-grid">
                <div className="card patient-card">
                    <h2>{appointment.patient?.name}</h2>
                    <div className="meta">
                        Phone: {appointment.patient?.phone || "—"}
                    </div>
                    <div className="meta">
                        DOB/age: {appointment.patient?.age || "—"}
                    </div>
                    <div className="meta">
                        Slot: {appointment.slot} •{" "}
                        {new Date(appointment.appointmentDate).toLocaleString()}
                    </div>

                    <div className="section">
                        <h4>Reason</h4>
                        <p>
                            {appointment.reason ||
                                appointment.symptoms ||
                                "Not specified"}
                        </p>
                    </div>
                </div>

                <div className="card action-card">
                    <h3>Consultation</h3>

                    <label>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={6}
                    ></textarea>

                    <label>Prescription</label>
                    <textarea
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        rows={6}
                    ></textarea>

                    <div className="action-row">
                        <button className="btn-save" onClick={savePrescription}>
                            Save Prescription
                        </button>
                        <button className="btn-complete" onClick={markComplete}>
                            Mark Completed
                        </button>
                        <button
                            className="btn-cancel"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
