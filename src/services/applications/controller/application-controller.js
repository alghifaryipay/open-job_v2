import ApplicationRepositories from '../repositories/application-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const submitNewApplication = async (req, res, next) => {
  const applicationPayload = {
    user_id: req.validated.user_id,
    job_id: req.validated.job_id,
    status: req.validated.status,
  };

  const newApplication = await ApplicationRepositories.createApplication(applicationPayload);

  if (!newApplication) {
    return next(new InvariantError('Gagal menambahkan lamaran'));
  }

  return response(res, 201, 'Lamaran berhasil ditambahkan', { 
    id: newApplication.id 
  });
};

export const fetchAllApplications = async (req, res, next) => {
  const applicationList = await ApplicationRepositories.getApplications();
  return response(res, 200, 'Daftar lamaran', { applications: applicationList });
};

export const findApplicationDetails = async (req, res, next) => {
  const targetId = req.params.id;
  const applicationData = await ApplicationRepositories.getApplicationById(targetId);

  if (!applicationData) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Detail lamaran', { ...applicationData });
};

export const fetchApplicationsByUser = async (req, res, next) => {
  const targetUserId = req.params.id;
  const applicationList = await ApplicationRepositories.getApplicationsByUserId(targetUserId);
  
  return response(res, 200, 'Daftar lamaran berdasarkan user', { applications: applicationList });
};

export const fetchApplicationsByJob = async (req, res, next) => {
  const targetJobId = req.params.id;
  const applicationList = await ApplicationRepositories.getApplicationsByJobId(targetJobId);
  
  return response(res, 200, 'Daftar lamaran berdasarkan job', { applications: applicationList });
};

export const modifyApplicationStatus = async (req, res, next) => {
  const targetId = req.params.id;
  
  // Pemetaan objek untuk update
  const updatePayload = {
    status: req.validated.status,
  };

  const updatedApplication = await ApplicationRepositories.updateApplication(targetId, updatePayload);

  if (!updatedApplication) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Lamaran berhasil diperbarui', { 
    id: updatedApplication.id 
  });
};

export const removeApplicationRecord = async (req, res, next) => {
  const targetId = req.params.id;
  const deletedApplication = await ApplicationRepositories.deleteApplication(targetId);

  if (!deletedApplication) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Lamaran berhasil dihapus', { 
    id: deletedApplication.id 
  });
};