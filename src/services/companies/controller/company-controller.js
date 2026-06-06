import CompanyRepositories from '../repositories/company-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const insertCompanyRecord = async (req, res, next) => {
  const companyPayload = {
    name: req.validated.name,
    location: req.validated.location,
    description: req.validated.description,
  };

  const newCompany = await CompanyRepositories.createCompany(companyPayload);

  if (!newCompany) {
    return next(new InvariantError('Gagal menambahkan perusahaan.'));
  }

  return response(res, 201, 'Perusahaan berhasil ditambahkan', {
    id: newCompany.id,
  });
};

export const fetchAllCompanies = async (req, res, next) => {
  const companyList = await CompanyRepositories.getCompanies();
  return response(res, 200, 'Perusahaan berhasil ditampilkan', { 
    companies: companyList 
  });
};

export const findCompanyDetails = async (req, res, next) => {
  const targetCompanyId = req.params.id;
  const companyData = await CompanyRepositories.getCompanyById(targetCompanyId);

  if (!companyData) {
    return next(new NotFoundError('Perusahaan tidak ditemukan.'));
  }

  return response(res, 200, 'Perusahaan berhasil ditampilkan', {
    id: companyData.id,
    name: companyData.name,
    location: companyData.location,
    description: companyData.description,
  });
};

export const modifyCompanyRecord = async (req, res, next) => {
  const targetCompanyId = req.params.id;
  
  const updatePayload = {
    id: targetCompanyId,
    name: req.validated.name,
    location: req.validated.location,
    description: req.validated.description,
  };

  const updatedCompany = await CompanyRepositories.editCompany(updatePayload);

  if (!updatedCompany) {
    return next(new NotFoundError('Perusahaan tidak ditemukan'));
  }

  return response(res, 200, 'Perusahaan berhasil diedit', {
    id: updatedCompany.id,
  });
};

export const deleteCompanyRecord = async (req, res, next) => {
  const targetCompanyId = req.params.id;
  const deletedCompany = await CompanyRepositories.deleteCompany(targetCompanyId);

  if (!deletedCompany) {
    return next(new NotFoundError('Perusahaan tidak ditemukan.'));
  }

  return response(res, 200, 'Perusahaan berhasil dihapus', {
    id: deletedCompany.id,
  });
};