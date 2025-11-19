import express from "express";
import {
    signUp,
    login,
    updateProfile,
    checkAuth,
    getUserInfo,
    markOnline,
    markOffline,
} from "../controllers/UserController.js";
import { protectRoute } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.patch("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);
userRouter.get("/get-user-info", protectRoute, getUserInfo);
userRouter.patch("/online", protectRoute, markOnline);
userRouter.patch("/offline", protectRoute, markOffline);

export default userRouter;
