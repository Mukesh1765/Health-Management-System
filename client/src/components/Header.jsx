import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="header">
            <nav className="nav-container">
                <div className="nav-content">
                    <div className="logo-wrapper">
                        <img
                            src="/logo.png"
                            alt="Dr Connect Logo"
                            onClick={() => navigate("/")}
                        />
                        <div className="logo">Dr Connect</div>
                    </div>
                    <div className="nav-links">
                        <a href="#home">Home</a>
                        <a href="#features">Features</a>
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                    </div>

                    <div className="nav-buttons">
                        <button
                            className="btn-primary"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            Create Account
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Login
                        </button>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="mobile-menu active">
                        <a href="#features">Account Features</a>
                        <a href="#price">Price Alerts</a>
                        <a href="#about">About Us</a>
                        <a href="#faq">FAQ</a>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            Create Account
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Login
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
