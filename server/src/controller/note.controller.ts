import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import Note from "../models/note.model.js";

// @desc    Get user's notes
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: AuthRequest, res: Response) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const note = await Note.create({
    user: req.user._id,
    content,
  });

  res.status(201).json(note);
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  // Ensure the logged-in user owns the note
  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await note.deleteOne();
  res.json({ message: "Note removed" });
};
