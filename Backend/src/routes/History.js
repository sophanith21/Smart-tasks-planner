import { Router } from "express";
import {
  createSuggestion,
  deleteSuggestion,
  getSuggestionDetails,
  getSuggestions,
  updateSuggestion,
} from "../controllers/historyController.js";
import validateHistoryReq from "../midldewares/validateHistoryReq.js";

const router = Router();

router.get("/history", getSuggestions);
router.get("/history/:id", validateHistoryReq, getSuggestionDetails);
router.delete("/history/:id", validateHistoryReq, deleteSuggestion);
router.post("/history", createSuggestion);
router.patch("/history/:id", updateSuggestion);

export default router;
