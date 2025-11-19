import { useState, useEffect, useContext, useRef } from "react";
import { Form, useActionData, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth-base.css";

export default function Login() {
    const actionData = useActionData();
    const [showPassword, setShowPassword] = useState(false);
    const { authUser, auth, loading, role, setRole } = useContext(AuthContext);
    const navigate = useNavigate();

    // Prevent repeated login request
    const loginTriggered = useRef(false);

    // When actionData returns from <Form>, trigger context login
    useEffect(() => {
        if (actionData?.success && !authUser && !loginTriggered.current) {
            loginTriggered.current = true;
            auth("login", actionData.credentials);
        }
    }, [actionData]); // intentionally not adding auth

    // Redirect AFTER authUser is set after login
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
                    <h1 className="form-title">Welcome Back</h1>
                    <p className="form-subtitle">Sign in to continue</p>

                    {/* FORM START */}
                    <Form method="post" className="form-fields">
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className="form-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="form-input"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-button"
                            onClick={() =>
                                console.log(`action data: ${actionData}`)
                            }
                        >
                            Sign In
                        </button>
                    </Form>
                    {/* FORM END */}

                    <p className="toggle-auth-text">
                        Don't have an account?{" "}
                        <a href="/signup" className="toggle-auth-link">
                            Sign Up
                        </a>
                    </p>

                    {actionData?.success && (
                        <p style={{ marginTop: "10px", color: "green" }}>
                            Login sent to action!
                        </p>
                    )}
                </div>

                {/* RIGHT SECTION */}
                <div className="info-section">
                    <div className="info-content">
                        <h2 className="info-title">Hello, Friend!</h2>
                        <p className="info-description">
                            Enter your credentials and start your journey with
                            us today.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
