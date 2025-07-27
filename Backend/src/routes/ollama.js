import { Router } from "express";

import { getSuggestion } from "../controllers/ollamaController.js";

const router = Router();

router.post("/ollama", getSuggestion);

export default router;
