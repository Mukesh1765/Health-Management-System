const API =
    import.meta.env.VITE_MEDICINES_API ||
    "https://medicine-services-production.up.railway.app";

class MedicinesService {
    async search(query = "") {
        const url = query
            ? `${API}/api/medicines/search?q=${encodeURIComponent(query)}`
            : `${API}/api/medicines`;

        const res = await fetch(url);
        const data = await res.json();
        return data.medicines || [];
    }

    async getCategories() {
        const res = await fetch(`${API}/api/medicines/categories`);
        const data = await res.json();
        return data.categories || [];
    }
}

export default new MedicinesService();
