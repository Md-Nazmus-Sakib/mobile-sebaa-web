/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TUser } from './user.interface';
import { User } from './user.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
//================================================================================
const getUserDataFromDB = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail }).select('-password');

  return result;
};
//================================================================================

//================================================================================
const updateUserDataIntoDB = async (
  userEmail: string,
  payload: Partial<TUser>,
) => {
  // Check if the payload contains the role field
  if ('role' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Role cannot be changed');
  }
  if ('email' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email cannot be changed');
  }
  const result = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  return result;
};
//================================================================================

//================================================================================
const deleteUserDataIntoDB = async (userEmail: string) => {
  // Find the user by email
  const user = await User.findOne({ email: userEmail });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${userEmail} does not exist.`,
    );
  }

  // Check if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `The user with the email ${userEmail} is blocked by Admin and cannot be deleted.`,
    );
  }

  // Set the 'isDeleted' field to true
  const payload = { isDeleted: true };

  const result = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  return result;
};
//================================================================================

//================================================================================
const toggleUserStatusIntoDB = async (id: string, status: string) => {
  // Find the user by ID
  const user = await User.findOne({ _id: id });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with ID ${id} does not exist.`,
    );
  }

  // Set the 'status' field to the new value
  const payload = { status };

  // Update the user status
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  // If no user was updated, throw an error
  if (!updatedUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with ID ${id} was not updated.`,
    );
  }

  return updatedUser;
};

//================================================================================

//================================================================================
const updateUserRoleIntoDB = async (id: string, role: string) => {
  // Update user role and return updated user (excluding password)
  const updatedUser = await User.findOneAndUpdate(
    { _id: id }, // Corrected the query
    { $set: { role } }, // Directly updating role
    { new: true, runValidators: true, select: '-password' }, // Ensuring proper validation and response
  );

  // If user is not found, throw an error
  if (!updatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exist.');
  }

  return updatedUser;
};
//================================================================================

//================================================================================
const getAllUserDataFromDB = async () => {
  const users = await User.find().select('-password');
  const totalUsers = await User.countDocuments(); // Get the total count

  return { users, totalUsers };
};
//================================================================================

//================================================================================
const createImageIntoDB = async (file: any, userEmail: string) => {
  // Step 1: Find the user by email
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${userEmail} does not exist.`,
    );
  }

  // Step 2: Check if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `The user with the email ${userEmail} is blocked by Admin and cannot upload an image.`,
    );
  }

  // Step 3: Check if the file exists
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No file provided for upload.');
  }

  try {
    // Step 4: Upload image to Cloudinary
    const imageName = `${user.email}-profile-image`;
    const path = file.path; // Path to the uploaded file

    const { secure_url } = await sendImageToCloudinary(imageName, path);

    // Step 5: Update the user's profile image in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { profileImg: secure_url } }, // Update the profileImg field
      { new: true, runValidators: true }, // Return the updated document
    )
      .select('-password') // Exclude the password field
      .lean(); // Converts the Mongoose document to a plain object

    // Step 6: Return all user data including the updated profile image
    return updatedUser;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An error occurred while uploading the image.',
    );
  }
};

//================================================================================
export const UserServices = {
  getUserDataFromDB,
  updateUserDataIntoDB,
  deleteUserDataIntoDB,
  toggleUserStatusIntoDB,
  getAllUserDataFromDB,
  createImageIntoDB,
  updateUserRoleIntoDB,
};
