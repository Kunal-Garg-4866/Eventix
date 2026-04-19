import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationType: { type: String, enum: ['solo', 'team'], required: true },
    soloParticipant: {
      name: { type: String, trim: true },
      rollNumber: { type: String, trim: true },
    },
    teamName: { type: String, trim: true, default: '' },
    teamMembers: { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, student: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
