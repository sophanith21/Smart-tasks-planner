import { Router } from "express";
import {
  createNewSchedule,
  deleteWeeklySchedule,
  deleteWeeklyScheduleRow,
  getWeeklySchedule,
  updateWeeklySchedule,
} from "../controllers/weeklyScheduleController.js";

const router = Router();

router.get("/weekly-schedule", getWeeklySchedule);
router.post("/weekly-schedule", createNewSchedule);
router.patch("/weekly-schedule", updateWeeklySchedule);
router.delete("/weekly-schedule", deleteWeeklySchedule);
router.delete("/weekly-schedule/row", deleteWeeklyScheduleRow);

export default router;
