import { Router } from "express";
import {
  createHabit,
  deleteHabit,
  getHabits,
  getWellnessSummary,
  updateHabit,
} from "../controllers/habitController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get("/", getHabits);
router.get("/summary", getWellnessSummary);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

export default router;
