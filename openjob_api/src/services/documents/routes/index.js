import { Router } from "express";
import authenticateToken from "../../../middleware/auth.js";
import { uploadPdf } from "../../../middleware/uploadPdf.js";
import {
  uploadNewDocument,
  fetchAllDocuments,
  findDocumentById,
  removeDocumentRecord,
} from "../controller/document-controller.js";

const router = Router();

router.get("/documents", fetchAllDocuments);
router.get("/documents/:id", findDocumentById);

router.post(
  "/documents",
  authenticateToken,
  uploadPdf.single("document"),
  uploadNewDocument
);

router.delete("/documents/:id", authenticateToken, removeDocumentRecord);

export default router;