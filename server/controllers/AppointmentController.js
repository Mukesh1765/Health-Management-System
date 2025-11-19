import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

export const getDoctorsInfo = async (req, res) => {
    try {
        const doctors = await User.find({ role: "doctor" }).select(
            "-password -isActive -isVerified -__v"
        );

        return res.json({
            success: true,
            doctors,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await User.findOne({ _id: id, role: "doctor" }).select(
            "-password -__v"
        );

        if (!doctor) {
            return res.json({
                success: false,
                message: "Doctor not found",
            });
        }

        return res.json({
            success: true,
            doctor,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 1️⃣ Book Appointment (Patient side)
// =========================
export const bookAppointment = async (req, res) => {
    try {
        const patientId = req.user._id;
        const {
            doctorId,
            appointmentDate,
            slot,
            mode,
            reason,
            symptoms,
            patientName,
        } = req.body;

        if (!doctorId || !appointmentDate || !slot) {
            return res.json({
                success: false,
                message: "Doctor, date and slot are required",
            });
        }

        // symptoms must be array
        const finalSymptoms = Array.isArray(symptoms) ? symptoms : [];

        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== "doctor") {
            return res.json({ success: false, message: "Invalid doctor" });
        }

        // Slot check only by date + slot
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);

        // UPDATED: Exclude both cancelled AND completed appointments
        const existing = await Appointment.findOne({
            doctor: doctorId,
            slot,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled", "completed"] }, // Changed from $ne to $nin
        });

        if (existing) {
            return res.json({
                success: false,
                message: "This slot is already booked",
            });
        }

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            slot,
            mode,
            reason,
            symptoms: finalSymptoms,
            consultationFee: doctor.consultationFee || 0,
            createdBy: patientId,
            patientName,
        });

        // REMOVE booked slot
        await User.findByIdAndUpdate(doctorId, {
            $pull: { availableSlots: slot },
        });

        return res.json({
            success: true,
            message: "Appointment booked successfully",
            appointment,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 2️⃣ Get Appointments of Logged Patient
// =========================
export const getMyAppointments = async (req, res) => {
    try {
        const userId = req.user._id;

        const appointments = await Appointment.find({ patient: userId })
            .populate("doctor", "name specialization consultationFee")
            .sort({ appointmentDate: -1 });

        return res.json({ success: true, appointments });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 3️⃣ Get Appointments for Doctor
// =========================
export const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.user._id;

        if (req.user.role !== "doctor") {
            return res.json({
                success: false,
                message: "Only doctors can view this",
            });
        }

        const appointments = await Appointment.find({ doctor: doctorId })
            .populate("patient", "name age gender phone")
            .sort({ appointmentDate: 1 });

        return res.json({ success: true, appointments });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 4️⃣ Update Appointment Status (doctor)
// =========================
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;

        const allowed = ["pending", "confirmed", "cancelled", "completed"];

        if (!allowed.includes(status)) {
            return res.json({
                success: false,
                message: "Invalid status",
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                status,
                updatedBy: req.user._id,
            },
            { new: true }
        );

        if (!appointment)
            return res.json({
                success: false,
                message: "Appointment not found",
            });

        return res.json({ success: true, appointment });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 5️⃣ Add Prescription (doctor)
// =========================
export const addPrescription = async (req, res) => {
    try {
        const { appointmentId, notes, prescription } = req.body;

        let parsedPrescription = prescription;

        // If prescription is a string, convert JSON → object
        if (typeof prescription === "string") {
            parsedPrescription = JSON.parse(prescription.trim());
        }

        const updated = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                notes,
                prescription: parsedPrescription, // FIXED
                status: "completed",
                updatedBy: req.user._id,
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Prescription updated",
            appointment: updated,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// =========================
// 6️⃣ Cancel Appointment (patient/doctor)
// =========================
export const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch appointment first
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.json({
                success: false,
                message: "Appointment not found",
            });
        }

        // Only patient or doctor who created it should cancel
        if (
            String(appointment.patient) !== String(req.user._id) &&
            String(appointment.doctor) !== String(req.user._id)
        ) {
            return res.json({
                success: false,
                message: "Unauthorized: Cannot cancel this appointment",
            });
        }

        // UPDATE appointment to cancelled
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                status: "cancelled",
                updatedBy: req.user._id,
            },
            { new: true }
        );

        // RESTORE slot back to doctor.availableSlots
        await User.findByIdAndUpdate(appointment.doctor, {
            $addToSet: { availableSlots: appointment.slot }, // prevents duplicates
        });

        return res.json({
            success: true,
            message: "Appointment cancelled",
            appointment: updatedAppointment,
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
