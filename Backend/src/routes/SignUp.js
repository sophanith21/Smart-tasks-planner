import { Router } from "express";
import { register } from "../controllers/authController.js";

const signUpRouter = Router();

signUpRouter.post("/signup", register);

export default signUpRouter;
