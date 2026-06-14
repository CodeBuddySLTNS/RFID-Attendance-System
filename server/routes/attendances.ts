import express from "express";
import { tryCatch } from "../lib/utils.js";
import handlers from "../handlers/attendances.js";

const router = express.Router();

router.get("/", tryCatch(handlers.getAttendances));
router.post("/add", tryCatch(handlers.addAttendance));

export default router;
