import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique email for each user
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    profileImg: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['Admin', 'User', 'Sp'], // Aligned with your role types
      required: true,
      default: 'User',
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'], // Aligned with your status types
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: { type: Boolean, default: false },
    country: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

//pre save middleware/hook:will work om  create()  save()

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds),
      );
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

// Type guard for checking if the update operation contains a password field
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasPasswordField = (update: any): update is { password: string } => {
  return update && typeof update.password === 'string';
};

// Hash password before updating (for updateOne and findOneAndUpdate)
userSchema.pre('updateOne', async function (next) {
  const update = this.getUpdate();
  if (hasPasswordField(update)) {
    try {
      update.password = await bcrypt.hash(
        update.password,
        Number(config.bcrypt_salt_rounds),
      );
    } catch (err) {
      return next(err as Error);
    }
  }
  next();
});

//post save middleware / hook
// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Export the User Model
export const User = model<TUser>('User', userSchema);
