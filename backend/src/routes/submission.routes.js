import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAllSubmissions, getAllSubmissionsForProblem, getSubmissionCountForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getAllSubmissionsForProblem);
submissionRoutes.get("/get-submissions-count/:problemId", authMiddleware, getSubmissionCountForProblem);

export default submissionRoutes;

