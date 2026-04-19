import mongoose from 'mongoose';

const societySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    logo: { type: String, default: '' },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  },
  { timestamps: true }
);

export const Society = mongoose.model('Society', societySchema);
