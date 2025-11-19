// src/pages/DoctorProfile.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/doctor-profile.css";

export default function DoctorProfile() {
    const { authUser, updateProfile, loading } = useContext(AuthContext);
    const [form, setForm] = useState({});
    const [edit, setEdit] = useState(false);
    const navigate = useNavigate();

    // Load data into form
    useEffect(() => {
        if (authUser) {
            setForm({
                name: authUser.name || "",
                phone: authUser.phone || "",
                specialization: authUser.specialization || "",
                qualification: authUser.qualification || "",
                experience: authUser.experience || "",
                consultationFee: authUser.consultationFee || "",
                languages: (authUser.languages || []).join(", "),
                availableSlots: (authUser.availableSlots || []).join(", "),
                about: authUser.about || "",
                clinicAddress: {
                    street: authUser.clinicAddress?.street || "",
                    city: authUser.clinicAddress?.city || "",
                    state: authUser.clinicAddress?.state || "",
                    pincode: authUser.clinicAddress?.pincode || "",
                },
            });
        }
    }, [authUser]);

    // Update main fields
    const update = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // Address object updater
    const updateAddress = (key, value) =>
        setForm((prev) => ({
            ...prev,
            clinicAddress: { ...prev.clinicAddress, [key]: value },
        }));

    // Save button
    const save = async () => {
        try {
            const body = {
                ...form,
                experience: Number(form.experience || 0),
                consultationFee: Number(form.consultationFee || 0),

                languages: form.languages
                    ? form.languages.split(",").map((v) => v.trim())
                    : [],

                availableSlots: form.availableSlots
                    ? form.availableSlots.split(",").map((v) => v.trim())
                    : [],

                clinicAddress: {
                    street: form.clinicAddress.street,
                    city: form.clinicAddress.city,
                    state: form.clinicAddress.state,
                    pincode: form.clinicAddress.pincode,
                },
            };

            await updateProfile(body);
            toast.success("Profile updated");
            setEdit(false);
        } catch (err) {
            toast.error(err.message || "Update failed");
        }
    };

    if (loading)
        return <div className="doctor-profile-wrapper">Loading...</div>;

    return (
        <div className="doctor-profile-wrapper">
            {/* ======== TOP BAR ======== */}
            <div className="dp-topbar">
                <button className="dp-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h1 className="dp-title">Doctor Profile</h1>
            </div>

            <div className="dp-container">
                {/* ======== LEFT CARD (Main Profile) ======== */}
                <div className="dp-card">
                    {!edit ? (
                        <>
                            <h2 className="dp-name">{authUser?.name}</h2>

                            <div className="dp-info">
                                <p>
                                    <strong>Specialization:</strong>{" "}
                                    {authUser?.specialization || "—"}
                                </p>
                                <p>
                                    <strong>Qualification:</strong>{" "}
                                    {authUser?.qualification || "—"}
                                </p>
                                <p>
                                    <strong>Experience:</strong>{" "}
                                    {authUser?.experience || "—"} yrs
                                </p>
                                <p>
                                    <strong>Consultation Fee:</strong> ₹
                                    {authUser?.consultationFee ?? "—"}
                                </p>
                                <p>
                                    <strong>Languages:</strong>{" "}
                                    {(authUser?.languages || []).join(", ") ||
                                        "—"}
                                </p>
                                <p>
                                    <strong>Available Slots:</strong>{" "}
                                    {(authUser?.availableSlots || []).join(
                                        ", "
                                    ) || "—"}
                                </p>
                                <p>
                                    <strong>About:</strong>{" "}
                                    {authUser?.about || "—"}
                                </p>
                            </div>

                            <button
                                className="dp-edit-btn"
                                onClick={() => setEdit(true)}
                            >
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Editable Fields */}
                            <div className="dp-field">
                                <label>Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        update("name", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) =>
                                        update("phone", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>Specialization</label>
                                <input
                                    value={form.specialization}
                                    onChange={(e) =>
                                        update("specialization", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>Qualification</label>
                                <input
                                    value={form.qualification}
                                    onChange={(e) =>
                                        update("qualification", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-row">
                                <div className="dp-field">
                                    <label>Experience (yrs)</label>
                                    <input
                                        type="number"
                                        value={form.experience}
                                        onChange={(e) =>
                                            update("experience", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="dp-field">
                                    <label>Consultation Fee</label>
                                    <input
                                        type="number"
                                        value={form.consultationFee}
                                        onChange={(e) =>
                                            update(
                                                "consultationFee",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="dp-field">
                                <label>Languages (comma separated)</label>
                                <input
                                    value={form.languages}
                                    onChange={(e) =>
                                        update("languages", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>Available Slots (comma separated)</label>
                                <input
                                    value={form.availableSlots}
                                    onChange={(e) =>
                                        update("availableSlots", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>About</label>
                                <textarea
                                    rows={3}
                                    value={form.about}
                                    onChange={(e) =>
                                        update("about", e.target.value)
                                    }
                                ></textarea>
                            </div>

                            {/* Clinic address */}
                            <h3 className="dp-subtitle">Clinic Address</h3>

                            <div className="dp-field">
                                <label>Street</label>
                                <input
                                    value={form.clinicAddress.street}
                                    onChange={(e) =>
                                        updateAddress("street", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>City</label>
                                <input
                                    value={form.clinicAddress.city}
                                    onChange={(e) =>
                                        updateAddress("city", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>State</label>
                                <input
                                    value={form.clinicAddress.state}
                                    onChange={(e) =>
                                        updateAddress("state", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-field">
                                <label>Pincode</label>
                                <input
                                    value={form.clinicAddress.pincode}
                                    onChange={(e) =>
                                        updateAddress("pincode", e.target.value)
                                    }
                                />
                            </div>

                            <div className="dp-actions">
                                <button className="dp-save" onClick={save}>
                                    Save
                                </button>
                                <button
                                    className="dp-cancel"
                                    onClick={() => setEdit(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* ======== RIGHT CARD (Side Details) ======== */}
                <div className="dp-card side-card">
                    <h4>Clinic Details</h4>
                    <p>
                        <strong>Street:</strong>{" "}
                        {authUser?.clinicAddress?.street || "—"}
                    </p>
                    <p>
                        <strong>City:</strong>{" "}
                        {authUser?.clinicAddress?.city || "—"}
                    </p>
                    <p>
                        <strong>State:</strong>{" "}
                        {authUser?.clinicAddress?.state || "—"}
                    </p>
                    <p>
                        <strong>Pincode:</strong>{" "}
                        {authUser?.clinicAddress?.pincode || "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
