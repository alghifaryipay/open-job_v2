import { Router } from "express";
import { validate } from "../../../middleware/validate.js";
import {
  CreateApplicationSchema,
  UpdateApplicationSchema,
} from "../validator/schema.js";
import authenticateToken from "../../../middleware/auth.js";
import { uploadPdf } from "../../../middleware/uploadPdf.js";
import {
  submitNewApplication,
  fetchAllApplications,
  findApplicationDetails,
  fetchApplicationsByUser,
  fetchApplicationsByJob,
  modifyApplicationStatus,
  removeApplicationRecord,
  uploadApplicationDocument,
} from "../controller/application-controller.js";

const router = Router();

router.post(
  "/applications",
  authenticateToken,
  validate(CreateApplicationSchema),
  submitNewApplication,
);

router.post(
  '/applications/:id/document',
  authenticateToken,
  uploadPdf.single('document'),
  uploadApplicationDocument,
);

router.get("/applications", authenticateToken, fetchAllApplications);
router.get(
  "/applications/user/:id",
  authenticateToken,
  fetchApplicationsByUser,
);
router.get("/applications/job/:id", authenticateToken, fetchApplicationsByJob);
router.get("/applications/:id", authenticateToken, findApplicationDetails);

router.put(
  "/applications/:id",
  authenticateToken,
  validate(UpdateApplicationSchema),
  modifyApplicationStatus,
);

router.delete("/applications/:id", authenticateToken, removeApplicationRecord);

export default router;
