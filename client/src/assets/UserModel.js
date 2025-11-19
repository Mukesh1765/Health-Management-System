export default class User {
    constructor(data = {}) {
        Object.assign(this, data);
    }

    // Editable patient-only fields
    static editableFields = {
        name: { type: "text" },
        phone: { type: "text" },
        profilePicture: { type: "image" },
        bloodGroup: {
            type: "select",
            options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        age: { type: "number" },
        gender: { type: "select", options: ["Male", "Female", "Other"] },
        allergies: { type: "array" },
        chronicConditions: { type: "array" },

        address: {
            type: "object",
            children: {
                street: { type: "text" },
                city: { type: "text" },
                state: { type: "text" },
                pincode: { type: "text" },
                country: { type: "text" },
            },
        },
    };
}
