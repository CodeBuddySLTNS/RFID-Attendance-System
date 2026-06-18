import express from "express";
import { tryCatch } from "../lib/utils.js";
import handlers from "../handlers/auth.js";

const router = express.Router();

router.post("/signup", tryCatch(handlers.signup));
router.post("/login", tryCatch(handlers.login));
router.post("/refresh", tryCatch(handlers.refresh));

export default router;
