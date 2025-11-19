import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/doctorHeader.css";
import { User, CalendarCheck } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function DoctorHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Dashboard", path: "/doctor/dashboard" },
        { label: "Appointments", path: "/doctor/appointments" },
        { label: "Profile", path: "/doctor/profile" },
    ];

    return (
        <header className="d-header">
            <nav className="d-nav-container">
                <div className="d-nav-content">
                    {/* LOGO LEFT */}
                    <div
                        className="d-logo-wrapper"
                        onClick={() => navigate("/doctor/dashboard")}
                    >
                        <img src="/logo.png" alt="Dr Connect" />
                        <span className="d-logo">Dr Connect</span>
                    </div>

                    {/* NAV LINKS */}
                    <div className="d-nav-links">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={
                                    location.pathname === item.path
                                        ? "d-nav-link active"
                                        : "d-nav-link"
                                }
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* PROFILE DROPDOWN */}
                    <div className="d-profile-wrapper">
                        <button
                            className="d-profile-btn"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <User size={20} />
                        </button>

                        {profileOpen && (
                            <div className="d-profile-menu">
                                <button
                                    onClick={() => navigate("/doctor/profile")}
                                >
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

                    {/* MOBILE MENU */}
                    <button
                        className="d-mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ☰
                    </button>
                </div>

                {menuOpen && (
                    <div className="d-mobile-menu">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                className={
                                    location.pathname === item.path
                                        ? "d-mobile-link active"
                                        : "d-mobile-link"
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

                        <button onClick={() => navigate("/doctor/profile")}>
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
}
