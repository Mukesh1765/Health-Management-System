import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./library/db.js";
import userRouter from "./routes/userRouter.js";
import appointmentRouter from "./routes/AppointmentRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import medicineRoutes from "./routes/medicineRoutes.js";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());

app.use("/api/status", (req, res) => res.send("Server is live!"));
app.use("/api/auth", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/medicines", medicineRoutes);

await connectDB();

const port = process.env.PORT || 1700;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

export default app;
