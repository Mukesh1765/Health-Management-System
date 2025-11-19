import { useEffect } from "react";
import Cookies from "js-cookie";

export default function usePresence() {
    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) return;

        const baseURL = import.meta.env.VITE_BACKEND_URL;

        // ---- ONLINE FUNCTION ----
        const goOnline = () => {
            fetch(baseURL + "/api/auth/online", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
            }).catch(() => {});
        };

        // ---- OFFLINE FUNCTION (for tab/browser close only) ----
        const goOffline = () => {
            try {
                navigator.sendBeacon(
                    baseURL + "/api/auth/offline",
                    JSON.stringify({ token })
                );
            } catch {
                // fallback, in case beacon fails
                fetch(baseURL + "/api/auth/offline", {
                    method: "PATCH",
                    keepalive: true,
                    headers: {
                        "Content-Type": "application/json",
                        token,
                    },
                }).catch(() => {});
            }
        };

        // ---- Only mark ONLINE when page is opened or becomes active ----
        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                goOnline();
            }
        };

        // ---- Trigger OFFLINE ONLY DURING TAB CLOSE / BROWSER CLOSE ----
        const onBeforeUnload = () => {
            goOffline();
        };

        // ---- INITIAL: mark user online ----
        goOnline();

        // ---- EVENTS ----
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener("beforeunload", onBeforeUnload);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange
            );
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);
}
