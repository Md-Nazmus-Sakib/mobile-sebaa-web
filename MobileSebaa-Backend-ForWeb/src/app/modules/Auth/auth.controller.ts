/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { AuthServices } from './auth.service';
import AppError from '../../errors/AppErrors';

//==========================================================

//Create User Controller
const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await AuthServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Verification code sent to your email.',
    data: result,
  });
});

//=========================================================

//==========================================================

//Login User Controller
const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully.',
    data: result,
  });
});

//==============================================================

//==========================================================

//Verify User Controller
const verifyUser = catchAsync(async (req, res) => {
  const verifiedCodeData = req.body;
  const result = await AuthServices.verifyUserData(verifiedCodeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User verified successfully.',
    data: result,
  });
});

//=========================================================
//==========================================================

//Resend Verify code Controller
const resendVerificationCode = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.verificationCodeResend(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification code resent successfully.',
    data: result,
  });
});

//=========================================================
//==========================================================

//Forget password Controller
const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body; // Destructure email from req.body
  const result = await AuthServices.forgetPassword(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset code has been sent successfully.',
    data: result,
  });
});
//==========================================================

//Reset password Controller
const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

//=========================================================

export const AuthController = {
  createUser,
  loginUser,
  verifyUser,
  resendVerificationCode,
  forgetPassword,
  resetPassword,
};
