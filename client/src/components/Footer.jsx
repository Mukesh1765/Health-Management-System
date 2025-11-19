import { useState } from "react";

const Footer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.message) {
            alert("Please fill in all fields");
            return;
        }

        console.log("Form submitted:", formData);
        alert("Request submitted successfully! We will get back to you soon.");

        // Reset form
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                <div className="contact-form-wrapper">
                    <h3>Can't find what you are looking for?</h3>
                    <p className="contact-form-subtitle">
                        Our in-house staff are here to help.
                    </p>

                    <div>
                        <div className="form-grid">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <textarea
                            name="message"
                            placeholder="Message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows="5"
                            className="form-textarea"
                        ></textarea>
                        <div className="form-submit">
                            <button
                                onClick={handleSubmit}
                                className="btn-submit"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    <p>&copy; 2025 DR.Connect. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
