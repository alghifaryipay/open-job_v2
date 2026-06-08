import UserRepositories from '../repositories/user-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';

export const registerNewUser = async (req, res, next) => {
  const userEmail = req.validated.email;

  const isEmailExist = await UserRepositories.verifyNewEmail(userEmail);

  if (isEmailExist) {
    return next(new InvariantError('Gagal menambahkan user. Email sudah digunakan.'));
  }

  const userPayload = {
    name: req.validated.name,
    email: userEmail,
    password: req.validated.password,
    role: req.validated.role,
  };

  const newUser = await UserRepositories.createUser(userPayload);

  if (!newUser) {
    return next(new InvariantError('Gagal menambahkan user.'));
  }

  return response(res, 201, 'User berhasil ditambahkan', {
    id: newUser.id,
  });
};

export const findUserDetails = async (req, res, next) => {
  const targetUserId = req.params.id;
  const result = await UserRepositories.getUserById(targetUserId);

  const userData = result?.data || result;

  if (!userData) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }

  if (result?.fromCache) {
    res.set('X-Data-Source', 'cache');
  }

  return response(res, 200, 'User berhasil ditampilkan', {
    name: userData.name,
  });
};