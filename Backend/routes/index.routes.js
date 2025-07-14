import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Welcome to the Backend API");
});

export const indexRoutes = router;
