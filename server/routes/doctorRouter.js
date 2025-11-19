// routes/doctorRoutes.js
import express from "express";
import {
    getDoctorsInfo,
    getDoctorById,
} from "../controllers/AppointmentController.js";

const router = express.Router();

router.get("/", getDoctorsInfo);
router.get("/:id", getDoctorById);

export default router;
