const mongoose = require('mongoose');

const documentationSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    file: {
      originalName: { type: String, required: true },   // e.g. "report.pdf"
      storedName:   { type: String, required: true },   // uuid filename on disk
      mimeType:     { type: String, required: true },   // application/pdf | application/vnd.openxmlformats...
      size:         { type: Number, required: true },   // bytes
      path:         { type: String, required: true },   // server file path / cloud URL
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'changes-required'],
      default: 'pending',
    },

    // Only admin can write this
    adminComment: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Documentation', documentationSchema);