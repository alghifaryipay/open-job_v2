import ApplicationRepositories from "../repositories/application-repositories.js";
import response from "../../../utils/response.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";
import { sendToQueue } from "../../../utils/rabbitmq.js";

export const submitNewApplication = async (req, res, next) => {
  try {
    const applicationPayload = {
      user_id: req.validated.user_id,
      job_id: req.validated.job_id,
      status: req.validated.status,
    };

    const newApplication =
      await ApplicationRepositories.createApplication(applicationPayload);

    if (!newApplication) {
      return next(new InvariantError("Gagal menambahkan lamaran"));
    }

    // Publish ke RabbitMQ
    await sendToQueue(newApplication.id);

    return response(res, 201, "Lamaran berhasil ditambahkan", {
      id: newApplication.id,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllApplications = async (req, res, next) => {
  const applicationList = await ApplicationRepositories.getApplications();
  return response(res, 200, "Daftar lamaran", {
    applications: applicationList,
  });
};

export const findApplicationDetails = async (req, res, next) => {
  const targetId = req.params.id;

  const result = await ApplicationRepositories.getApplicationById(targetId);

  if (!result.data) {
    return next(new NotFoundError("Lamaran tidak ditemukan"));
  }

  if (result.fromCache) {
    res.set("X-Data-Source", "cache");
  }

  return response(res, 200, "Detail lamaran", result.data);
};

export const fetchApplicationsByUser = async (req, res, next) => {
  const targetUserId = req.params.id;

  const result =
    await ApplicationRepositories.getApplicationsByUserId(targetUserId);

  if (result.fromCache) {
    res.set("X-Data-Source", "cache");
  }

  return response(res, 200, "Daftar lamaran berdasarkan user", {
    applications: result.data,
  });
};

export const fetchApplicationsByJob = async (req, res, next) => {
  const targetJobId = req.params.id;

  const result =
    await ApplicationRepositories.getApplicationsByJobId(targetJobId);

  if (result.fromCache) {
    res.set("X-Data-Source", "cache");
  }

  return response(res, 200, "Daftar lamaran berdasarkan job", {
    applications: result.data,
  });
};

export const modifyApplicationStatus = async (req, res, next) => {
  const targetId = req.params.id;

  // Pemetaan objek untuk update
  const updatePayload = {
    status: req.validated.status,
  };

  const updatedApplication = await ApplicationRepositories.updateApplication(
    targetId,
    updatePayload,
  );

  if (!updatedApplication) {
    return next(new NotFoundError("Lamaran tidak ditemukan"));
  }

  return response(res, 200, "Lamaran berhasil diperbarui", {
    id: updatedApplication.id,
  });
};

export const removeApplicationRecord = async (req, res, next) => {
  const targetId = req.params.id;
  const deletedApplication =
    await ApplicationRepositories.deleteApplication(targetId);

  if (!deletedApplication) {
    return next(new NotFoundError("Lamaran tidak ditemukan"));
  }

  return response(res, 200, "Lamaran berhasil dihapus", {
    id: deletedApplication.id,
  });
};

export const uploadApplicationDocument = async (req, res, next) => {
  try {
    const applicationId = req.params.id;

    if (!req.file) {
      return next(new InvariantError("File PDF wajib diupload"));
    }

    const savedDocument = await ApplicationRepositories.saveDocument(
      applicationId,
      req.file.filename,
    );

    return response(res, 201, "Dokumen berhasil diupload", {
      documentId: savedDocument.id,

      fileName: req.file.filename,

      fileUrl: `/uploads/cv/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
};
