import express from "express";
import {
    bookAppointment,
    getMyAppointments,
    getDoctorAppointments,
    updateAppointmentStatus,
    addPrescription,
    cancelAppointment,
} from "../controllers/AppointmentController.js";
import { protectRoute } from "../middlewares/auth.js";

const appointmentRouter = express.Router();

// --------------------------
// Patient Routes
// --------------------------

// Book an appointment
appointmentRouter.post("/book", protectRoute, bookAppointment);

// Get logged-in patient's appointments
appointmentRouter.get("/my-appointments", protectRoute, getMyAppointments);

// Cancel appointment (patient or doctor)
appointmentRouter.patch("/cancel", protectRoute, cancelAppointment);

// --------------------------
// Doctor Routes
// --------------------------

// Doctor: Get all appointments assigned to them
appointmentRouter.get(
    "/doctor-appointments",
    protectRoute,
    getDoctorAppointments
);

// Doctor: Update appointment status
appointmentRouter.patch(
    "/update-status",
    protectRoute,
    updateAppointmentStatus
);

// Doctor: Add prescription
appointmentRouter.patch("/add-prescription", protectRoute, addPrescription);

export default appointmentRouter;
