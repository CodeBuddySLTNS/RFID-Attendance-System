import express from "express";
import { tryCatch } from "../lib/utils.js";
import handlers from "../handlers/students.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", tryCatch(handlers.getStudents));
router.post("/add", upload.single("photo"), tryCatch(handlers.addStudent));
router.get("/:id", tryCatch(handlers.getStudent));
router.patch("/:id", upload.single("photo"), tryCatch(handlers.updateStudent));
router.delete("/:id", tryCatch(handlers.deleteStudent));

export default router;
