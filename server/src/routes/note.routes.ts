import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import {
  createNote,
  deleteNote,
  getNotes,
} from "../controller/note.controller.js";

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

router.route("/").get(getNotes).post(createNote);
router.route("/:id").delete(deleteNote);

export default router;
