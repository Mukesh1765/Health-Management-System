import { useState, useEffect, useContext, useRef } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import "../styles/auth-base.css";

export default function Signup() {
    const actionData = useActionData();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { authUser, auth, loading, setRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const signupTriggered = useRef(false);

    // Trigger signup after Form action submits data
    useEffect(() => {
        console.log(`action data changed: ${actionData}`);
        if (actionData?.success && !authUser && !signupTriggered.current) {
            signupTriggered.current = true;
            auth("signup", actionData.credentials);
        }

        if (actionData?.success === false) {
            toast.error(actionData.message);
        }
    }, [actionData]);

    // Redirect after authUser becomes available
    useEffect(() => {
        if (!loading && authUser) {
            if (authUser.role === "doctor") {
                setRole("doctor");
                navigate("/doctor");
            } else {
                setRole("patient");
                navigate("/role");
            }
        }
    }, [authUser, loading]);

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="form-section">
                    <h1 className="form-title">Create Account</h1>
                    <p className="form-subtitle">Join our platform</p>

                    <Form method="post" className="form-fields">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Phone Number
                                </label>
                                <div className="input-wrapper">
                                    <Phone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+1234567890"
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type={showPass ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Confirm Password
                                </label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        className="form-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowConfirm(!showConfirm)
                                        }
                                    >
                                        {showConfirm ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select name="role" className="form-input" required>
                                <option value="">Select role</option>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-button">
                            Create Account
                        </button>
                    </Form>

                    <p className="toggle-auth-text">
                        Already have an account?{" "}
                        <a href="/login" className="toggle-auth-link">
                            Sign In
                        </a>
                    </p>
                </div>

                <div className="info-section">
                    <div className="info-content">
                        <h2 className="info-title">Welcome Aboard!</h2>
                        <p className="info-description">
                            Fill in your information and join our community.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
