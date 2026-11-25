import Note from "../models/Note.js";
import mongoose from "mongoose";

function getValidatedNoteData(body) {
  const { title, content } = body ?? {};

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !content.trim()
  ) {
    return null;
  }

  return {
    title: title.trim(),
    content: content.trim(),
  };
}

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); //newest first
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getNoteByID(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid note ID." });
  }
  try {
    const notes = await Note.findById(req.params.id);
    if (!notes) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getNoteByID controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function CreateNote(req, res) {
  try {
    //get the title and content from the body (the user input them)
    // const { title, content } = req.body;

    // //create a new Note object
    // const note = new Note({ title, content });

    const noteData = getValidatedNoteData(req.body);

    if (!noteData) {
      return res.status(400).json({
        message: "Title and content must be non-empty strings.",
      });
    }

    const note = new Note(noteData);

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function UpdateNote(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid note ID." });
  }
  try {
    const noteData = getValidatedNoteData(req.body);

    if (!noteData) {
      return res.status(400).json({
        message: "Title and content must be non-empty strings.",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, noteData, {
      new: true,
      runValidators: true,
    });

    // if note not found (incorrect id)
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function DeleteNote(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid note ID." });
  }
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    return res.status(204).end();
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
