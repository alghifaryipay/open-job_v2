import UserRepositories from '../../users/repositories/user-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import response from '../../../utils/response.js';

export const authenticateUserLogin = async (req, res, next) => {
  const userEmail = req.validated.email;
  const userPassword = req.validated.password;

  const verifiedUserId = await UserRepositories.verifyUserCredential(userEmail, userPassword);

  if (!verifiedUserId) {
    return next(new AuthenticationError('Kredensial yang Anda berikan salah'));
  }

  // Payload untuk pembuatan token dipisah ke dalam variabel
  const tokenPayload = { id: verifiedUserId };

  const generatedAccessToken = TokenManager.generateAccessToken(tokenPayload);
  const generatedRefreshToken = TokenManager.generateRefreshToken(tokenPayload);

  await AuthenticationRepositories.addRefreshToken(generatedRefreshToken);

  return response(res, 200, 'Authentication berhasil ditambahkan', {
    accessToken: generatedAccessToken,
    refreshToken: generatedRefreshToken,
  });
};

export const renewAccessToken = async (req, res, next) => {
  const providedRefreshToken = req.validated.refreshToken;

  const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(providedRefreshToken);

  if (!isTokenValid) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  const decodedToken = TokenManager.verifyRefreshToken(providedRefreshToken);
  const newAccessToken = TokenManager.generateAccessToken({ id: decodedToken.id });

  return response(res, 200, 'Access Token berhasil diperbarui', {
    accessToken: newAccessToken,
  });
};

export const processUserLogout = async (req, res, next) => {
  const providedRefreshToken = req.validated.refreshToken;
  
  const isTokenValid = await AuthenticationRepositories.verifyRefreshToken(providedRefreshToken);

  if (!isTokenValid) {
    return next(new InvariantError('Refresh token tidak valid'));
  }

  await AuthenticationRepositories.deleteRefreshToken(providedRefreshToken);

  return response(res, 200, 'Refresh token berhasil dihapus');
};