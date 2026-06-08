import { Router } from "express";
import authenticateToken from "../../../middleware/auth.js";
import { uploadPdf } from "../../../middleware/uploadPdf.js";
import { validate } from "../../../middleware/validate.js";
import { CreateDocumentSchema } from "../validator/schema.js";
import {
  uploadNewDocument,
  fetchAllDocuments,
  findDocumentById,
  removeDocumentRecord,
} from "../controller/document-controller.js";

const router = Router();

router.get("/documents", authenticateToken, fetchAllDocuments);
router.get("/documents/:id", authenticateToken, findDocumentById);
router.post(
  "/documents",
  authenticateToken,
  uploadPdf.single("document"), // Multipart form-data dengan nama field 'document'
  validate(CreateDocumentSchema), // Memvalidasi field 'application_id' pada req.body
  uploadNewDocument
);
router.delete("/documents/:id", authenticateToken, removeDocumentRecord);

export default router;