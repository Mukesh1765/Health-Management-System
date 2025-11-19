import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../assets/utils.js";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [token, setToken] = useState(Cookies.get("token") || null);
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const [userData, setUserData] = useState(null);

    const checkAuth = async () => {
        try {
            setLoading(true);

            const existingToken = Cookies.get("token");

            if (!existingToken) {
                setAuthUser(null);
                setLoading(false);
                return;
            }

            const res = await api.get("/api/auth/check");

            if (res?.success) {
                setAuthUser(res.user);
            } else {
                setAuthUser(null);
                Cookies.remove("token");
                toast.error(res?.message || "Session expired");
            }
        } catch (err) {
            Cookies.remove("token");
            setAuthUser(null);
            toast.error(err?.message || "Auth failed");
        } finally {
            setLoading(false);
        }
    };

    const auth = async (state, credentials) => {
        try {
            const res = await api.post(`/api/auth/${state}`, credentials);
            if (res?.success) {
                Cookies.set("token", res.token, { expires: 7 });
                setToken(res.token);
                setAuthUser(res.userData);
                toast.success(res.message);
            } else {
                console.log("Authentication failed:", res);
                toast.error(res?.message || "Authentication failed");
            }
        } catch (error) {
            toast.error(error?.message || "Network error");
        }
    };

    const logout = () => {
        Cookies.remove("token");
        setToken(null);
        setAuthUser(null);
        toast.success("Logged Out Successfully");
    };

    const updateProfile = async (payload) => {
        try {
            const res = await api.patch(`/api/auth/update-profile`, payload);

            if (!res.success) throw new Error(res.message);

            setAuthUser((prev) => ({
                ...prev,
                ...res.user, // updated backend user
            }));

            return res.user;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        if (token) checkAuth();
        else setAuthUser(null);
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                authUser,
                onlineUsers,
                auth,
                logout,
                updateProfile,
                loading,
                role,
                setRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
