import express from "express";
import { tryCatch } from "../lib/utils.js";
import handlers from "../handlers/departments.js";

const router = express.Router();

router.get("/", tryCatch(handlers.getDepartments));

export default router;
