/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '../../config';
import { TUser } from '../Users/user.interface';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken, generateRandomCode } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { VerificationCode } from './auth.model';
import { transporter } from '../../utils/email';

//================================================================
// Create User

const createUserIntoDB = async (userData: TUser) => {
  const { email } = userData;

  // Check if a user with the provided email already exists
  const existingUser = await User.findOne({ email });

  // If the user does not exist, create a new one
  if (!existingUser) {
    const newUser = await User.create(userData);

    // Generate a verification code and set its expiration time
    const code = generateRandomCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await VerificationCode.create({ userId: newUser._id, code, expiresAt });

    // Send the verification code via email
    try {
      await transporter.sendMail({
        from: config.email_user,
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Your verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to send verification email. Please try again.',
      );
    }

    // Exclude the password from the returned user object
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  // Handle existing user scenarios
  if (existingUser.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked by admin.');
  }

  if (!existingUser.isVerified) {
    // Update user data with the new registration info (and hash password if present)
    if (userData.password) {
      try {
        userData.password = await bcrypt.hash(
          userData.password,
          Number(config.bcrypt_salt_rounds), // Adjust the salt rounds as needed
        );
      } catch (err) {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Failed to hash password',
        );
      }
    }

    // Update user data
    const updatedUser = await User.updateOne(
      { email },
      {
        $set: {
          ...userData, // Include updated user data
          updatedAt: new Date(), // Update the timestamp
        },
      },
    );

    // Generate a new verification code
    const code = generateRandomCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Update or create the verification code
    await VerificationCode.findOneAndUpdate(
      { userId: existingUser._id },
      { code, expiresAt },
      { upsert: true, new: true }, // Update or insert new verification code
    );

    // Send the new verification code via email
    try {
      await transporter.sendMail({
        from: config.email_user,
        to: email,
        subject: 'Verify Your Email - Updated Information',
        html: `<p>Your new verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
      });
    } catch (error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to send verification email. Please try again.',
      );
    }

    // Return an error indicating that verification is required
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User is not verified. Please verify your account.',
    );
  }

  if (existingUser.isDeleted) {
    // If the user is marked as deleted, restore the user
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { ...userData, isDeleted: false } },
      { new: true, runValidators: true },
    ).select('-password');

    return updatedUser;
  }

  // If the user already exists and is active
  throw new AppError(httpStatus.CONFLICT, 'User already exists.');
};
//================================================================

//verify user data

const verifyUserData = async (verifiedCodeData: {
  email: string;
  code: string;
}) => {
  const { email, code } = verifiedCodeData;
  const user = await User.findOne({ email }).select('-password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified.');
  }

  const record = await VerificationCode.findOne({ userId: user._id, code });

  if (!record) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid verification code.');
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Verification code has expired.',
    );
  }

  user.isVerified = true;
  await user.save();
  await VerificationCode.deleteOne({ _id: record._id });

  return user;
};

//================================================================

// Log in User

const loginUser = async (payload: TLoginUser) => {
  if (!payload.email || !payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Email and password are required.',
    );
  }

  // Normalize email (e.g., trim, convert to lowercase)
  const sanitizedEmail = payload.email.trim().toLowerCase();

  // Find the user and include the password field
  const user = await User.findOne({ email: sanitizedEmail }).select(
    '+password',
  );

  // Check if the user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Check if the password matches
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect email or password.');
  }

  // Additional checks for account status
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted.');
  }

  // Handle unverified users
  if (!user.isVerified) {
    const code = generateRandomCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry time

    // Update or create a verification code in the database
    await VerificationCode.findOneAndUpdate(
      { userId: user._id },
      { code, expiresAt },
      { upsert: true, new: true },
    );

    // Send the verification email

    await transporter.sendMail({
      from: config.email_user,
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Your verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
    });
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Verification code resend successfully.Please check your email.',
    );
  }

  // Blocked account check
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been blocked.');
  }

  // Generate token
  const token = createToken(
    { userEmail: user.email, role: user.role },
    config.jwt_access_token!,
    config.jwt_refresh_expires_in!,
  );

  // Exclude password from the user object before returning
  const { password, ...userWithoutPassword } = user.toObject();

  return { token, user: userWithoutPassword };
};

//Verification Code Resend

const verificationCodeResend = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified.');
  }

  const code = generateRandomCode();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await VerificationCode.findOneAndUpdate(
    { userId: user._id },
    { code, expiresAt },
    { upsert: true, new: true },
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Resend Verification Code',
    html: `<p>Your new verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
  });

  return { message: 'Verification code resent successfully.' };
};

//================================================================
// Forget Password

const forgetPassword = async (email: string) => {
  // Validate email input
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is required.');
  }

  // Check if the user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist.',
    );
  }

  // Check if the user's email is verified
  if (!user.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'User email is not verified.');
  }

  // Generate a random verification code and set expiration time (10 minutes)
  const code = generateRandomCode(); // Assumes you have a function to generate a random code
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  // Save the verification code in the database (upsert for existing records)
  await VerificationCode.findOneAndUpdate(
    { userId: user._id }, // Filter by user ID
    { code, expiresAt }, // Update or create with code and expiration time
    { upsert: true, new: true }, // Create a new record if one doesn't exist
  );

  // Send the reset code via email
  try {
    await transporter.sendMail({
      from: config.email_user,
      to: email,
      subject: 'Password Reset Request',
      text: `You have requested to reset your password. Use the following code to reset it within three minutes: ${code}`,
    });
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send reset code.',
    );
  }
};

//================================================================
// Reset Password

const resetPassword = async (payload: {
  email: string;
  code: string;
  newPassword: string;
}) => {
  // Check if the user exists using the provided email
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if the user is marked as deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  // Check if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Check if the user's email is verified
  if (!user.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'User email is not verified.');
  }
  // Validate the verification code
  const record = await VerificationCode.findOne({
    userId: user._id,
    code: payload.code,
  });

  if (!record) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid verification code.');
  }

  // Check if the verification code has expired
  if (record.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Reset Verification code has expired.',
    );
  }

  // Delete the verification code record after successful validation
  await VerificationCode.deleteMany({ _id: record._id });

  // Update the user's password and reset related flags
  user.password = payload.newPassword; // No need to hash manually

  // Save the updated user
  await user.save();
};

export const AuthServices = {
  createUserIntoDB,
  loginUser,
  verifyUserData,
  verificationCodeResend,
  forgetPassword,
  resetPassword,
};
