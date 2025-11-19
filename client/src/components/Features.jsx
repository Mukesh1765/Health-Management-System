const Features = () => {
    const features = [
        {
            icon: (
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            ),
            title: "Book Appointments",
            description:
                "Schedule consultations with top specialists. Choose from in-person or video visits.",
            iconClass: "blue",
        },
        {
            icon: (
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M10.5 20.5L10.5 5.5"></path>
                    <path d="M7.5 8.5L13.5 8.5"></path>
                    <path d="M7.5 14.5L13.5 14.5"></path>
                    <ellipse cx="10.5" cy="3.5" rx="3" ry="3"></ellipse>
                    <ellipse cx="10.5" cy="20.5" rx="3" ry="3"></ellipse>
                </svg>
            ),
            title: "Order Medicines",
            description:
                "Browse and order from a wide range of medicines with fast home delivery.",
            iconClass: "green",
        },
        {
            icon: (
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            ),
            title: "Health Records",
            description:
                "Access your complete medical history, prescriptions, and reports anytime.",
            iconClass: "orange",
        },
    ];

    return (
        <section className="features" id="features">
            <div className="features-container">
                <div className="features-header">
                    <h2>Complete Healthcare Solution</h2>
                    <p className="features-subtitle">
                        Everything you need for managing your health
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div
                                className={`feature-icon ${feature.iconClass}`}
                            >
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
