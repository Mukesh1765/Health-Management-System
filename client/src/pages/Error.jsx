import { useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    return (
        <div className="error-container">
            <div className="triangle">
                <div className="content-wrapper">
                    <div className="exclamation-mark">!</div>
                    <h2 className="error-status">Error {error.status}</h2>
                    <h2 className="error-title">Page Not Found</h2>
                    <button
                        className="home-button"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                    <h4 className="error-description">
                        You have entered to a page that does not exist, go to
                        home by clicking home
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default Error;
