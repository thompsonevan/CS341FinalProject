import { Router } from "express";
import {
  createEntry,
  deleteEntry,
  getEntries,
  updateEntry,
} from "../controllers/entryController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getEntries);
router.post("/", createEntry);
router.patch("/:id", updateEntry);
router.delete("/:id", deleteEntry);

export default router;
