import BookmarkRepositories from '../repositories/bookmark-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const addJobToBookmarks = async (req, res, next) => {
  const targetJobId = req.params.id;
  const currentUserId = req.user.id;

  const bookmarkPayload = { 
    user_id: currentUserId, 
    job_id: targetJobId 
  };

  const newBookmark = await BookmarkRepositories.createBookmark(bookmarkPayload);

  if (!newBookmark) {
    return next(new InvariantError('Gagal menambahkan bookmark'));
  }

  return response(res, 201, 'Bookmark berhasil ditambahkan', { 
    id: newBookmark.id 
  });
};

export const fetchUserBookmarks = async (req, res, next) => {
  const currentUserId = req.user.id;
  const bookmarkList = await BookmarkRepositories.getBookmarksByUserId(currentUserId);
  
  return response(res, 200, 'Daftar bookmark', { 
    bookmarks: bookmarkList 
  });
};

export const findBookmarkDetails = async (req, res, next) => {
  const targetBookmarkId = req.params.bookmarkId;
  const bookmarkData = await BookmarkRepositories.getBookmarkById(targetBookmarkId);

  if (!bookmarkData) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }
  return response(res, 200, 'Detail bookmark', { ...bookmarkData });
};

export const removeJobFromBookmarks = async (req, res, next) => {
  const targetJobId = req.params.id;
  const currentUserId = req.user.id;

  const deletePayload = { 
    user_id: currentUserId, 
    job_id: targetJobId 
  };

  const deletedBookmark = await BookmarkRepositories.deleteBookmarkByJobId(deletePayload);

  if (!deletedBookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Bookmark berhasil dihapus', { 
    id: deletedBookmark.id 
  });
};