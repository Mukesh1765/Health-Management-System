// controllers/doctorController.js
import User from "../models/User.js";

export const getDoctorsInfo = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).select(
            "-password -__v"
        );
        return res.json({ success: true, doctors });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const doc = await User.findById(req.params.id).select("-password -__v");
        if (!doc) return res.json({ success: false, message: "Not found" });
        return res.json({ success: true, doctor: doc });
    } catch (e) {
        return res.json({ success: false, message: e.message });
    }
};
