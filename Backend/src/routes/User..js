import { Router } from "express";
import { deleteAccount } from "../controllers/authController.js";

const router = Router();

router.delete("/user", deleteAccount);

export default router;
