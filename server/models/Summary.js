import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema(
  {
    summaryText: {
      type: String,
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    sourceType: {
      type: String,
      enum: ['text', 'file'],
      default: 'text',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Summary', summarySchema);