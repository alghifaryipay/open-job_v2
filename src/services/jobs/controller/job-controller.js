import JobRepositories from '../repositories/job-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const insertNewJob = async (req, res, next) => {
  const jobPayload = {
    title: req.validated.title,
    description: req.validated.description,
    jobType: req.validated.job_type,
    experienceLevel: req.validated.experience_level,
    locationType: req.validated.location_type,
    locationCity: req.validated.location_city,
    salaryMin: req.validated.salary_min,
    salaryMax: req.validated.salary_max,
    isSalaryVisible: req.validated.is_salary_visible,
    status: req.validated.status,
    companyId: req.validated.company_id,
    categoryId: req.validated.category_id,
  };

  const newJob = await JobRepositories.createJob(jobPayload);

  if (!newJob) {
    return next(new InvariantError('Gagal menambahkan lowongan kerja'));
  }

  return response(res, 201, 'Lowongan kerja berhasil ditambahkan', {
    id: newJob.id,
  });
};

export const fetchAllJobs = async (req, res, next) => {
  // Struktur diubah: ekstraksi parameter query secara eksplisit dengan optional chaining
  const searchFilters = {
    title: req.query.title?.toLowerCase(),
    company_name: req.query.company_name?.toLowerCase(),
  };
  
  const jobList = await JobRepositories.getJobs(searchFilters);
  
  return response(res, 200, 'Daftar lowongan kerja', { jobs: jobList });
};

export const findJobDetails = async (req, res, next) => {
  const jobId = req.params.id;
  const jobData = await JobRepositories.getJobById(jobId);

  if (!jobData) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  // Struktur diubah: memisahkan data respons ke dalam variabel tersendiri
  const responseData = {
    id: jobData.id,
    title: jobData.title,
  };

  return response(res, 200, 'Detail lowongan kerja', responseData);
};

export const fetchJobsByCompany = async (req, res, next) => {
  const companyId = req.params.id;
  const jobList = await JobRepositories.getJobsByCompanyId(companyId);

  if (!jobList) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Daftar lowongan kerja', { jobs: jobList });
};

export const fetchJobsByCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const jobList = await JobRepositories.getJobByCategoryId(categoryId);

  if (!jobList) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Daftar lowongan kerja', { jobs: jobList });
};

export const modifyJobRecord = async (req, res, next) => {
  const targetId = req.params.id;
  
  const updatePayload = {
    title: req.validated.title,
    description: req.validated.description,
    jobType: req.validated.job_type,
    experienceLevel: req.validated.experience_level,
    locationType: req.validated.location_type,
    locationCity: req.validated.location_city,
    salaryMin: req.validated.salary_min,
    salaryMax: req.validated.salary_max,
    isSalaryVisible: req.validated.is_salary_visible,
    status: req.validated.status,
    companyId: req.validated.company_id,
    categoryId: req.validated.category_id,
  };

  const updatedJob = await JobRepositories.updateJob(targetId, updatePayload);

  if (!updatedJob) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Lowongan kerja berhasil diedit', {
    id: updatedJob.id,
  });
};

export const removeJobPosting = async (req, res, next) => {
  const targetId = req.params.id;
  const deletedJob = await JobRepositories.deleteJob(targetId);

  if (!deletedJob) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Lowongan kerja berhasil dihapus', {
    id: deletedJob.id,
  });
};