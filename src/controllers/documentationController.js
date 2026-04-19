const Documentation = require('../models/Documentation');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// ─── Employee: Upload a document ────────────────────────────────────────────
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const { projectName, userId } = req.body;
    if (!projectName) return res.status(400).json({ msg: 'Project name is required' });
    if (!userId) return res.status(400).json({ msg: 'userId is required' });

    const doc = await Documentation.create({
      projectName,
      uploadedBy: userId,
      file: {
        originalName: req.file.originalname,
        storedName:   req.file.filename,
        mimeType:     req.file.mimetype,
        size:         req.file.size,
        path:         req.file.path,
      },
    });

    res.status(201).json({ msg: 'Document uploaded successfully', data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─── Employee: Get my documents ─────────────────────────────────────────────
const getMyDocuments = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ msg: 'userId is required' });

    const docs = await Documentation.find({ uploadedBy: userId })
      .sort({ createdAt: -1 });
    res.json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─── Employee: Delete own document ──────────────────────────────────────────
const deleteDocument = async (req, res) => {
  try {
    const doc = await Documentation.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    // Remove file from disk
    if (fs.existsSync(doc.file.path)) {
      fs.unlinkSync(doc.file.path);
    }

    await doc.deleteOne();
    res.json({ msg: 'Document deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─── Admin: Get all documents ────────────────────────────────────────────────
const getAllDocuments = async (req, res) => {
  try {
    const docs = await Documentation.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─── Admin: Update status + optional comment ─────────────────────────────────
const updateDocumentStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const allowed = ['pending', 'approved', 'changes-required'];
    if (!allowed.includes(status))
      return res.status(400).json({ msg: 'Invalid status value' });

    const doc = await Documentation.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    doc.status = status;
    if (adminComment !== undefined) doc.adminComment = adminComment;

    await doc.save();
    res.json({ msg: 'Document updated', data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ─── Shared: Download / stream a file ───────────────────────────────────────
const downloadDocument = async (req, res) => {
  try {
    const doc = await Documentation.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });

    if (!fs.existsSync(doc.file.path))
      return res.status(404).json({ msg: 'File not found on server' });

    res.download(doc.file.path, doc.file.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
  getAllDocuments,
  updateDocumentStatus,
  downloadDocument,
};