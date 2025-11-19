import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        // Common fields
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: { type: String, required: true, minlength: 8 },
        role: {
            type: String,
            enum: ["patient", "doctor"],
            required: true,
        },
        phone: { type: String, required: true },
        profilePicture: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },

        // Patient-specific fields
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
            default: null,
        },
        age: { type: Number, min: 0, max: 120 },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", null],
            default: null,
        },
        allergies: [{ type: String }],
        chronicConditions: [{ type: String }],
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },

        // Doctor-specific fields
        specialization: { type: String },
        qualification: { type: String },
        experience: { type: Number, min: 0, max: 60 },
        consultationFee: { type: Number, min: 0 },
        licenseNumber: { type: String },
        about: { type: String, maxlength: 500 },
        clinicAddress: {
            name: { type: String },
            street: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
        },
        workingHours: {
            monday: {
                start: String,
                end: String,
                available: { type: Boolean, default: true },
            },
            tuesday: {
                start: String,
                end: String,
                available: { type: Boolean, default: true },
            },
            wednesday: {
                start: String,
                end: String,
                available: { type: Boolean, default: true },
            },
            thursday: {
                start: String,
                end: String,
                available: { type: Boolean, default: true },
            },
            friday: {
                start: String,
                end: String,
                available: { type: Boolean, default: true },
            },
            saturday: {
                start: String,
                end: String,
                available: { type: Boolean, default: false },
            },
            sunday: {
                start: String,
                end: String,
                available: { type: Boolean, default: false },
            },
        },
        availableSlots: [{ type: String }],
        consultationModes: [{ type: String, enum: ["in-person", "video"] }],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        totalPatients: { type: Number, default: 0 },
        languages: [{ type: String }],

        lastLogin: { type: Date },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
