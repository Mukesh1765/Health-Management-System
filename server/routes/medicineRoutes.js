import express from "express";
import {
    createMedicine,
    getMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine,
    reduceStock,
} from "../controllers/medicineController.js";

import { protectRoute } from "../middlewares/auth.js";

const medicineRouter = express.Router();

// Only doctors/admins allowed in future
medicineRouter.post("/", protectRoute, createMedicine);

medicineRouter.get("/", protectRoute, getMedicines);

medicineRouter.get("/:id", protectRoute, getMedicineById);

medicineRouter.patch("/:id", protectRoute, updateMedicine);

medicineRouter.delete("/:id", protectRoute, deleteMedicine);

// reduce stock after prescription
medicineRouter.patch("/reduce-stock/use", protectRoute, reduceStock);

export default medicineRouter;
