import express from "express";
const router = express.Router();

import registerDoctorController from "../controllers/registerDoctorController.js";

router.route("/").post(registerDoctorController.register);
router.post("/verifyCodeEmail", registerDoctorController.verifyCodeEmail);

export default router;
