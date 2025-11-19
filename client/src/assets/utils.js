import Cookies from "js-cookie";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Your backend expects req.headers.token
const getToken = () => Cookies.get("token");

async function request(method, path, body, options = {}) {
    try {
        const headers = {
            "Content-Type":
                body instanceof FormData ? undefined : "application/json",
            token: getToken() || "",
            ...(options.headers || {}),
        };

        // Remove content-type if uploading file (FormData)
        if (body instanceof FormData) {
            delete headers["Content-Type"];
        }

        const response = await fetch(`${backendUrl}${path}`, {
            method,
            headers,
            body:
                body instanceof FormData
                    ? body
                    : body
                    ? JSON.stringify(body)
                    : null,
            ...options,
        });

        const json = await response.json().catch(() => ({}));

        return json;
    } catch (err) {
        return {
            success: false,
            message: err.message || "Network error",
        };
    }
}

const api = {
    get: (path, options = {}) => request("GET", path, null, options),
    post: (path, body, options = {}) => request("POST", path, body, options),
    put: (path, body, options = {}) => request("PUT", path, body, options),
    patch: (path, body, options = {}) => request("PATCH", path, body, options),
    delete: (path, options = {}) => request("DELETE", path, null, options),
};

export default api;
