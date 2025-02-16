import { model, Schema } from 'mongoose';

// Define the schema for verification codes
const verificationCodeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Export the VerificationCode model
export const VerificationCode = model(
  'VerificationCode',
  verificationCodeSchema,
);
