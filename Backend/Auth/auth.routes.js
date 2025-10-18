import { Router } from "express";
import { login, refresh, logout } from "./auth.controllers.js";
import { asyncHandler } from "../Middlewares/asyncHandler.js";

const router = Router();

router.post("/auth/login", asyncHandler(login));
router.post("/auth/refresh", asyncHandler(refresh));
router.post("/auth/logout", asyncHandler(logout));

export const authRoutes = router;
