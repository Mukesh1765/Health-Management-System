import { useEffect, useRef, useState } from "react";
import { useActionData, useNavigate } from "react-router-dom";
import ProfileController from "../assets/ProfileController";
import toast from "react-hot-toast";
import "../styles/profile.css";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const actionData = useActionData();
    const controllerRef = useRef(new ProfileController());
    const navigate = useNavigate();

    useEffect(() => {
        const controller = controllerRef.current;

        const listener = (e) => {
            const { type, payload } = e.detail;

            if (type === "loaded") {
                setProfile(payload);
                setForm(payload);
                setImagePreview(payload.profilePicture || null);
            }

            if (type === "updated") {
                toast.success("Profile updated!");
                setProfile(payload);
                setForm(payload);
                setEditMode(false);
            }

            if (type === "error") {
                toast.error(payload);
            }
        };

        controller.addEventListener("profile-event", listener);
        controller.loadProfile();

        return () => controller.removeEventListener("profile-event", listener);
    }, []);

    useEffect(() => {
        if (actionData?.success) {
            controllerRef.current.updateProfile(actionData.payload);
        }
    }, [actionData]);

    const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

    const updateAddress = (key, val) => {
        setForm((prev) => ({
            ...prev,
            address: { ...(prev.address || {}), [key]: val },
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            update("profilePicture", reader.result);
        };
        reader.readAsDataURL(file);
    };

    if (!profile) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="page-container">
            {/* BACK BUTTON */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>

            {/* MAIN LAYOUT */}
            <div className="profile-layout">
                {/* ================= LEFT PANEL ================= */}
                <div className="left-panel">
                    <div className="photo-box">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="photo"
                            />
                        ) : (
                            <div className="photo-placeholder">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {editMode && (
                            <label className="photo-edit-btn">
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                Edit Photo
                            </label>
                        )}
                    </div>

                    <div className="left-info">
                        <h1 className="name-display">
                            {editMode ? (
                                <input
                                    className="field-input name-field"
                                    value={form.name}
                                    onChange={(e) =>
                                        update("name", e.target.value)
                                    }
                                />
                            ) : (
                                profile.name
                            )}
                        </h1>

                        <p className="role-text">
                            {profile.role?.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="right-panel">
                    <div className="info-grid">
                        {/* AGE */}
                        <div className="field-block">
                            <label>Age</label>
                            {editMode ? (
                                <input
                                    type="number"
                                    className="field-input"
                                    value={form.age || ""}
                                    onChange={(e) =>
                                        update("age", Number(e.target.value))
                                    }
                                />
                            ) : (
                                <p>{profile.age || "—"}</p>
                            )}
                        </div>

                        {/* GENDER */}
                        <div className="field-block">
                            <label>Gender</label>
                            {editMode ? (
                                <select
                                    className="field-input"
                                    value={form.gender || ""}
                                    onChange={(e) =>
                                        update("gender", e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            ) : (
                                <p>{profile.gender || "—"}</p>
                            )}
                        </div>

                        {/* BLOOD GROUP */}
                        <div className="field-block">
                            <label>Blood Group</label>
                            {editMode ? (
                                <select
                                    className="field-input"
                                    value={form.bloodGroup || ""}
                                    onChange={(e) =>
                                        update("bloodGroup", e.target.value)
                                    }
                                >
                                    <option value="">Select</option>
                                    {[
                                        "A+",
                                        "A-",
                                        "B+",
                                        "B-",
                                        "AB+",
                                        "AB-",
                                        "O+",
                                        "O-",
                                    ].map((bg) => (
                                        <option key={bg}>{bg}</option>
                                    ))}
                                </select>
                            ) : (
                                <p>{profile.bloodGroup || "—"}</p>
                            )}
                        </div>

                        {/* PHONE */}
                        <div className="field-block">
                            <label>Phone</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.phone}
                                    onChange={(e) =>
                                        update("phone", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.phone || "—"}</p>
                            )}
                        </div>

                        {/* ALLERGIES */}
                        <div className="field-block">
                            <label>Allergies</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.allergies?.join(", ") || ""}
                                    onChange={(e) =>
                                        update(
                                            "allergies",
                                            e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                        )
                                    }
                                />
                            ) : (
                                <p>
                                    {(profile.allergies || []).join(", ") ||
                                        "—"}
                                </p>
                            )}
                        </div>

                        {/* CHRONIC CONDITIONS */}
                        <div className="field-block">
                            <label>Chronic Conditions</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={
                                        form.chronicConditions?.join(", ") || ""
                                    }
                                    onChange={(e) =>
                                        update(
                                            "chronicConditions",
                                            e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                        )
                                    }
                                />
                            ) : (
                                <p>
                                    {(profile.chronicConditions || []).join(
                                        ", "
                                    ) || "—"}
                                </p>
                            )}
                        </div>

                        {/* ADDRESS STREET */}
                        <div className="field-block full">
                            <label>Street</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.address?.street || ""}
                                    onChange={(e) =>
                                        updateAddress("street", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.address?.street || "—"}</p>
                            )}
                        </div>

                        <div className="field-block">
                            <label>City</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.address?.city || ""}
                                    onChange={(e) =>
                                        updateAddress("city", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.address?.city || "—"}</p>
                            )}
                        </div>

                        <div className="field-block">
                            <label>State</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.address?.state || ""}
                                    onChange={(e) =>
                                        updateAddress("state", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.address?.state || "—"}</p>
                            )}
                        </div>

                        <div className="field-block">
                            <label>Pincode</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.address?.pincode || ""}
                                    onChange={(e) =>
                                        updateAddress("pincode", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.address?.pincode || "—"}</p>
                            )}
                        </div>

                        <div className="field-block">
                            <label>Country</label>
                            {editMode ? (
                                <input
                                    className="field-input"
                                    value={form.address?.country || ""}
                                    onChange={(e) =>
                                        updateAddress("country", e.target.value)
                                    }
                                />
                            ) : (
                                <p>{profile.address?.country || "—"}</p>
                            )}
                        </div>
                    </div>

                    <div className="action-row">
                        {editMode ? (
                            <>
                                <button
                                    className="save-btn"
                                    onClick={() =>
                                        controllerRef.current.updateProfile(
                                            form
                                        )
                                    }
                                >
                                    Save Changes
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() => {
                                        setEditMode(false);
                                        setForm(profile);
                                        setImagePreview(profile.profilePicture);
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                className="edit-btn"
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
