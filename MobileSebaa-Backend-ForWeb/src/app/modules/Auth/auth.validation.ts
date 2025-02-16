import { z } from 'zod';

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email ID is required!',
      })
      .email('Invalid email format!'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email ID is required!',
      })
      .email('Invalid email format!'),
    code: z.string({
      required_error: 'Code is required!',
    }),
    newPassword: z.string({
      required_error: 'User New password is required!',
    }),
  }),
});

export const AuthValidation = {
  loginUserValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
