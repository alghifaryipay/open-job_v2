import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadPath = 'uploads/cv';

// Buat folder jika belum ada
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    const timestamp = Date.now();

    const safeFileName = file.originalname
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');

    cb(null, `${timestamp}-${safeFileName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(
      new Error('File harus berformat PDF'),
      false,
    );
  }

  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});