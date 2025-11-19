import User from "../assets/UserModel";
import api from "../assets/utils";

export default class ProfileController extends EventTarget {
    constructor() {
        super();
        this.user = null;
    }

    async loadProfile() {
        const res = await api.get("/api/auth/get-user-info");
        if (res.success) {
            this.user = new User(res.user);

            this.dispatchEvent(
                new CustomEvent("profile-event", {
                    detail: { type: "loaded", payload: this.user },
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent("profile-event", {
                    detail: { type: "error", payload: res.message },
                })
            );
        }
    }

    async updateProfile(data) {
        const res = await api.patch("/api/auth/update-profile", data);

        if (res.success) {
            this.user = new User(res.user);

            this.dispatchEvent(
                new CustomEvent("profile-event", {
                    detail: { type: "updated", payload: this.user },
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent("profile-event", {
                    detail: { type: "error", payload: res.message },
                })
            );
        }
    }
}
