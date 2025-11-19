import { generateToken } from "../library/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    try {
        if (!name || !email || !password || !phone || !role) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({
                success: false,
                message: "Account already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        const token = generateToken(newUser._id);

        res.json({
            success: true,
            userData: newUser,
            token,
            message: "Account Created Successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            userData.password
        );
        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: "Incorrect Credentials",
            });
        }

        const token = generateToken(userData._id);
        res.json({
            success: true,
            userData,
            token,
            message: "Login Successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const allowedUpdates = [
            "name",
            "phone",
            "profilePicture",
            "bloodGroup",
            "age",
            "gender",
            "allergies",
            "chronicConditions",
            "address",
            "specialization",
            "qualification",
            "experience",
            "consultationFee",
            "licenseNumber",
            "registrationNumber",
            "about",
            "clinicAddress",
            "workingHours",
            "availableSlots",
            "consultationModes",
            "languages",
            "awards",
        ];

        let updates = {};
        const data = req.body || {};

        // Safely parse JSON fields if they come as strings
        const fromJSON = (value) => {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        };

        for (const key of Object.keys(data)) {
            if (!allowedUpdates.includes(key)) continue;

            let val = fromJSON(data[key]);

            // Convert arrays if needed
            if (key === "languages" && typeof val === "string") {
                val = val.split(",").map((v) => v.trim());
            }

            if (key === "availableSlots" && typeof val === "string") {
                val = val.split(",").map((v) => v.trim());
            }

            // Convert numbers
            if (key === "experience" || key === "consultationFee") {
                val = Number(val);
            }

            // Clinic address merging
            if (key === "clinicAddress") {
                val = {
                    street: val.street || "",
                    city: val.city || "",
                    state: val.state || "",
                    pincode: val.pincode || "",
                };
            }

            updates[key] = val;
        }

        if (Object.keys(updates).length === 0) {
            return res.json({
                success: false,
                message: "No valid fields provided.",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update Profile Error:", error.message);
        return res.json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export const markOnline = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            isActive: true,
            lastOnline: new Date(),
        });

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const markOffline = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            isActive: false,
            lastOnline: new Date(),
        });

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
