import { Router } from "express";
import { getWeeklySchedule } from "../controllers/weeklyScheduleController.js";

const router = Router();

router.get("/weekly-schedule", getWeeklySchedule);

export default router;
