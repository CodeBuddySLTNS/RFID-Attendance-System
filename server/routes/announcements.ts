import express from "express";
import { tryCatch } from "../lib/utils.js";
import handlers from "../handlers/announcements.js";

const router = express.Router();

router.get("/public", tryCatch(handlers.getPublic));
router.get("/", tryCatch(handlers.getAll));
router.get("/:id", tryCatch(handlers.getById));
router.post("/", tryCatch(handlers.create));
router.patch("/:id", tryCatch(handlers.update));
router.delete("/:id", tryCatch(handlers.remove));

export default router;
