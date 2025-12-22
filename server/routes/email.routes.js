import express from "express";
import { emailSendController } from "../controllers/email.controllers.js";


const router = express.Router();

router.post("/send", emailSendController);

export default router;
