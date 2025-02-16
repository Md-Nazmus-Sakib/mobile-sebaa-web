import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email format' }),
    phone: z.string().min(10, {
      message: 'Mobile number must be at least 10 characters long',
    }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    role: z
      .enum(['Admin', 'User', 'Sp'], {
        required_error: 'Role is required',
        invalid_type_error: 'Role must be either Admin, User, or Sp',
      })
      .default('User'),
    status: z.enum(['in-progress', 'blocked']).default('in-progress'),
    isDeleted: z.boolean().default(false),
    isVerified: z.boolean().default(false),
    country: z.string().min(2, 'Country is required'),
  }),
});

export default createUserValidationSchema;
