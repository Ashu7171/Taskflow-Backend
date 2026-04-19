const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  getAllDocuments,
  updateDocumentStatus,
  downloadDocument,
} = require('../controllers/documentationController');

// ─── Multer config ───────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/documents'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  // 10 MB max
});

// ─── Employee routes ─────────────────────────────────────────────────────────
router.post('/',            upload.single('file'), uploadDocument);
router.get('/my',           getMyDocuments);
router.delete('/:id',       deleteDocument);
router.get('/download/:id', downloadDocument);

// ─── Admin routes ────────────────────────────────────────────────────────────
router.get('/',             getAllDocuments);
router.put('/:id/status',   updateDocumentStatus);

module.exports = router;