import CategoryRepositories from '../repositories/category-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const insertNewCategory = async (req, res, next) => {
  const categoryName = req.validated.name;

  const newCategory = await CategoryRepositories.createCategory(categoryName);

  if (!newCategory) {
    return next(new InvariantError('Gagal menambahkan kategori.'));
  }

  return response(res, 201, 'Kategori berhasil ditambahkan', {
    id: newCategory.id,
    name: newCategory.name,
  });
};

export const fetchAllCategories = async (req, res, next) => {
  const categoryList = await CategoryRepositories.getCategories();
  return response(res, 200, 'Kategori berhasil ditampilkan', {
    categories: categoryList,
  });
};

export const findCategoryDetails = async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryData = await CategoryRepositories.getCategoryById(categoryId);

  if (!categoryData) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil ditampilkan', {
    id: categoryData.id,
    name: categoryData.name,
  });
};

export const modifyCategoryRecord = async (req, res, next) => {
  const targetId = req.params.id;
  const updatedName = req.validated.name;

  const updatePayload = {
    id: targetId,
    name: updatedName,
  };

  const updatedCategory =
    await CategoryRepositories.editCategory(updatePayload);

  if (!updatedCategory) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil diedit', {
    id: updatedCategory.id,
    name: updatedCategory.name,
  });
};

export const removeCategoryRecord = async (req, res, next) => {
  const targetId = req.params.id;
  const deletedCategory = await CategoryRepositories.deleteCategory(targetId);

  if (!deletedCategory) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil dihapus', {
    id: deletedCategory.id,
  });
};
