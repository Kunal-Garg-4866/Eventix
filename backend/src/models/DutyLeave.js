import mongoose from 'mongoose';

const dutyLeaveSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

dutyLeaveSchema.index({ student: 1, event: 1 }, { uniqnue: true });

export const DutyLeave = mongoose.model('DutyLeave', dutyLeaveSchema);
