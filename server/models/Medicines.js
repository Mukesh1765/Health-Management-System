import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        manufacturer: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
        },

        expiryDate: {
            type: Date,
            required: false,
        },

        category: {
            type: String,
            enum: ["tablet", "capsule", "syrup", "drops", "injection", "other"],
            default: "other",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);
