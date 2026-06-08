import path from "path";
import fs from "fs";
import DocumentRepositories from "../repositories/document-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const uploadNewDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new InvariantError("File is required"));
    }

    const appId = req.body.applicationId || req.body.application_id || `dummy-app-${Date.now()}`;

    const savedDocument = await DocumentRepositories.createDocument(appId, req.file.filename);

    return response(res, 201, "Dokumen berhasil diupload", {
      documentId: savedDocument.id,
      filename: savedDocument.file_name,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllDocuments = async (req, res, next) => {
  try {
    const documentList = await DocumentRepositories.getAllDocuments();
    return response(res, 200, "Daftar dokumen", { 
      documents: documentList 
    });
  } catch (error) {
    next(error);
  }
};

export const findDocumentById = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const document = await DocumentRepositories.getDocumentById(targetId);

    if (!document) {
      return next(new NotFoundError("Dokumen tidak ditemukan"));
    }

    const filePath = path.resolve(`uploads/cv/${document.file_name}`);
    
    if (!fs.existsSync(filePath)) {
      return next(new NotFoundError("File fisik PDF tidak ditemukan di server"));
    }

    return res.download(filePath, document.file_name);
  } catch (error) {
    next(error);
  }
};

export const removeDocumentRecord = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const deletedDocument = await DocumentRepositories.deleteDocument(targetId);

    if (!deletedDocument) {
      return next(new NotFoundError("Dokumen tidak ditemukan"));
    }

    try {
      const filePath = path.resolve(`uploads/cv/${deletedDocument.file_name}`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (fsError) {
      console.error("Gagal menghapus file fisik PDF:", fsError);
    }

    return response(res, 200, "Dokumen berhasil dihapus", { 
      id: deletedDocument.id 
    });
  } catch (error) {
    next(error);
  }
};