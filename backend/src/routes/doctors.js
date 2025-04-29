import express from "express";
const router = express.Router();

import doctorsController from "../controllers/doctorsController.js";

router.route("/").get(doctorsController.getDoctor);

router
  .route("/:id")
  .get(doctorsController.getDoctor)
  .put(doctorsController.updateDoctor)
  .delete(doctorsController.deleteDoctor);

export default router;
