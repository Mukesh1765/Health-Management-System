import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        appointmentDate: {
            type: Date,
            required: true,
        },

        slot: {
            type: String, // "10:00-10:30 AM"
            required: true,
        },

        mode: {
            type: String,
            enum: ["in-person", "video"],
            default: "in-person",
        },

        reason: {
            type: String,
            maxlength: 200,
        },

        symptoms: [
            {
                type: String,
            },
        ],

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "pending",
        },

        consultationFee: {
            type: Number,
            default: 0,
        },

        transactionId: {
            type: String,
            default: null,
        },

        notes: {
            type: String,
            maxlength: 2000,
        },

        prescription: [
            {
                medicine: { type: String },
                dosage: { type: String },
                duration: { type: String },
            },
        ],

        followUpDate: {
            type: Date,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
