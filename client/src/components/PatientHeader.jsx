import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/patientHeader.css";
import { AuthContext } from "../context/AuthContext";

const PatientHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Appointments", path: "/role/appointments" },
        { label: "Medicines", path: "/medicines" },
        { label: "profile", path: "/role/profile" },
    ];

    return (
        <header className="p-header">
            <nav className="p-nav-container">
                <div className="p-nav-content">
                    {/* LOGO - NOW LEFTMOST */}
                    <div
                        className="p-logo-wrapper"
                        onClick={() => navigate("/")}
                    >
                        <img src="/logo.png" alt="Dr Connect Logo" />
                        <div className="p-logo">Dr Connect</div>
                    </div>

                    {/* NAVIGATION LINKS */}
                    <div className="p-nav-links">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={
                                    location.pathname === item.path
                                        ? "p-nav-link active"
                                        : "p-nav-link"
                                }
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* PROFILE DROPDOWN */}
                    <div className="p-profile-wrapper">
                        <button
                            className="p-profile-btn"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <div className="p-user-icon"></div>
                        </button>

                        {profileOpen && (
                            <div className="p-profile-menu">
                                <button onClick={() => navigate("/profile")}>
                                    My Profile
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                    }}
                                    className="logout-btn"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="p-mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                {menuOpen && (
                    <div className="p-mobile-menu">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={
                                    location.pathname === item.path
                                        ? "p-mobile-link active"
                                        : "p-mobile-link"
                                }
                                onClick={() => {
                                    navigate(item.path);
                                    setMenuOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}

                        <hr />

                        <button onClick={() => navigate("/profile")}>
                            My Profile
                        </button>

                        <button
                            onClick={() => {
                                logout();
                            }}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default PatientHeader;
