import { Router } from "express";

const router = Router();

router.get("/:id/tasks");
router.get("/:id/history");
router.get("/:id/weekly-schedule");
