import { Router } from 'express';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import createUserValidationSchema from '../Users/user.validation';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/signup',
  validateRequest(createUserValidationSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginUserValidationSchema),
  AuthController.loginUser,
);
router.post('/verify-code', AuthController.verifyUser);

router.post('/resend-code', AuthController.resendVerificationCode);

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthController.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword,
);

export const AuthRoutes = router;
