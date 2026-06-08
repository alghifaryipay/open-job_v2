import CompanyRepositories from '../repositories/company-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import redisClient from '../../../utils/redis.js'; // Wajib import redis

export const insertCompanyRecord = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const fetchAllCompanies = async (req, res, next) => {
  try {
    const companyList = await CompanyRepositories.getCompanies();
    return response(res, 200, 'Perusahaan berhasil ditampilkan', { 
      companies: companyList 
    });
  } catch (error) {
    next(error);
  }
};

export const findCompanyDetails = async (req, res, next) => {
  try {
    const targetCompanyId = req.params.id;
    const result = await CompanyRepositories.getCompanyById(targetCompanyId);

    // Mengantisipasi jika format balasan dari repository menggunakan { data, fromCache }
    const companyData = result?.data || result;

    if (!companyData) {
      return next(new NotFoundError('Perusahaan tidak ditemukan.'));
    }

    // Wajib Advanced: Header X-Data-Source jika dari cache
    if (result?.fromCache) {
      res.set('X-Data-Source', 'cache');
    }

    return response(res, 200, 'Perusahaan berhasil ditampilkan', {
      id: companyData.id,
      name: companyData.name,
      location: companyData.location,
      description: companyData.description,
    });
  } catch (error) {
    next(error);
  }
};

export const modifyCompanyRecord = async (req, res, next) => {
  try {
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

    // Wajib Advanced: Invalidasi (Hapus) cache saat data diperbarui
    await redisClient.del(`companies:${targetCompanyId}`);

    return response(res, 200, 'Perusahaan berhasil diedit', {
      id: updatedCompany.id,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyRecord = async (req, res, next) => {
  try {
    const targetCompanyId = req.params.id;
    const deletedCompany = await CompanyRepositories.deleteCompany(targetCompanyId);

    if (!deletedCompany) {
      return next(new NotFoundError('Perusahaan tidak ditemukan.'));
    }

    // Wajib Advanced: Invalidasi (Hapus) cache saat data dihapus
    await redisClient.del(`companies:${targetCompanyId}`);

    return response(res, 200, 'Perusahaan berhasil dihapus', {
      id: deletedCompany.id,
    });
  } catch (error) {
    next(error);
  }
};