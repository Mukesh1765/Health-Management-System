import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="hero" id="home">
            <div className="hero-pattern"></div>

            <div className="hero-content">
                <h1>Your Health, Connected. Anytime. Anywhere.</h1>
                <p className="hero-description">
                    DrConnect helps you consult doctors, manage prescriptions,
                    and access medical records in one secure place.
                </p>
                <div className="hero-buttons">
                    <button
                        className="btn-hero-primary"
                        onClick={() => {
                            navigate("/signup");
                        }}
                    >
                        Create Account
                    </button>
                    <button
                        className="btn-hero-secondary"
                        onClick={() => {
                            navigate("/login");
                        }}
                    >
                        Login
                    </button>
                </div>
                <div className="hero-features">
                    <span>No</span> Missing Prescriptions.
                    <span> No</span> Misplaced Medical Records.
                    <span> No</span> Appointment Hassles.
                    <span> No</span> Long Queues.
                </div>
            </div>
        </section>
    );
};

export default Hero;
