// src/assets/OrdersService.js
import Cookies from "js-cookie";

const API_ROOT =
    import.meta.env.VITE_MEDICINES_API ||
    "https://medicine-services-production.up.railway.app";

function getTokenHeader() {
    const token = Cookies.get("token") || "";
    return token ? { token } : {};
}

export default {
    createOrder: async (payload) => {
        const res = await fetch(`${API_ROOT}/api/medicines/orders/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(),
            },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    confirmOrder: async (orderId, paymentRef) => {
        const res = await fetch(
            `${API_ROOT}/api/medicines/orders/${orderId}/confirm`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...getTokenHeader(),
                },
                body: JSON.stringify({ paymentRef }),
            }
        );
        return res.json();
    },

    getMyOrders: async (user) => {
        const url = new URL(`${API_ROOT}/api/medicines/orders/my-orders`);
        if (user) url.searchParams.set("user", user);
        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...getTokenHeader(),
            },
        });
        return res.json();
    },
};
