import express from "express";
import {
  CreateNote,
  DeleteNote,
  getAllNotes,
  UpdateNote,
  getNoteByID,
} from "../controllers/notesController.js";

//app as the main server and router as a small set of routes that the server plugs in.
const router = express.Router();

router.get("/", getAllNotes);

router.get("/:id", getNoteByID);

router.post("/", CreateNote);

router.put("/:id", UpdateNote);

router.delete("/:id", DeleteNote);

export default router;
