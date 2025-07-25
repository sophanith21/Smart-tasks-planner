import { Router } from "express";
import {
  deleteWeeklyScheduleRow,
  getWeeklySchedule,
  updateWeeklySchedule,
} from "../controllers/weeklyScheduleController.js";

const router = Router();

router.get("/weekly-schedule", getWeeklySchedule);
router.patch("/weekly-schedule", updateWeeklySchedule);
router.delete("/weekly-schedule", deleteWeeklyScheduleRow);

export default router;
