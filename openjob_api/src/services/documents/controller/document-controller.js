import DocumentRepositories from "../repositories/document-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const uploadNewDocument = async (req, res, next) => {
  try {
    const { applicationId } = req.validated; 

    if (!req.file) {
      return next(new InvariantError("File PDF wajib diupload"));
    }

    const savedDocument = await DocumentRepositories.createDocument(applicationId, req.file.filename);

    return response(res, 201, "Dokumen berhasil diupload", {
      documentId: savedDocument.id,
      applicationId: savedDocument.application_id,
      fileName: savedDocument.file_name,
      fileUrl: `/uploads/cv/${savedDocument.file_name}`,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllDocuments = async (req, res, next) => {
  try {
    const documentList = await DocumentRepositories.getAllDocuments();
    
    // Mapping properti list ke camelCase
    const mappedDocuments = documentList.map((doc) => ({
      id: doc.id,
      applicationId: doc.application_id,
      fileName: doc.file_name,
      fileUrl: `/uploads/cv/${doc.file_name}`,
    }));

    return response(res, 200, "Daftar dokumen", { 
      documents: mappedDocuments 
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

   
    const mappedDocument = {
      id: document.id,
      applicationId: document.application_id, 
      fileName: document.file_name,
      fileUrl: `/uploads/cv/${document.file_name}`,
    };

    return response(res, 200, "Detail dokumen", mappedDocument);
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

    return response(res, 200, "Dokumen berhasil dihapus", { 
      id: deletedDocument.id 
    });
  } catch (error) {
    next(error);
  }
};