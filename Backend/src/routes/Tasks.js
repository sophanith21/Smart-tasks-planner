import { Router } from "express";
import {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/tasks", authMiddleware, getAllTasks);
router.post("/tasks", addTask);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

export default router;
