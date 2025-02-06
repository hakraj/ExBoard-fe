import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 3 characters' })
    .max(50, { message: 'Name must be at most 50 characters' }),
  reg_no: z.string().regex(/^\d{2}\/[A-Z]{3}\d{3}$/i, { message: 'Registration number must match the format; YY/ABC000' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirm_password: z.string()
    .min(6, { message: 'Confirm Password must be at least 6 characters' }),
}).required()
  .refine((data) => data.password === data.confirm_password, {
    message: "Password must match!",
    path: ['confirm_password']
  })

export const loginSchema = z.object({
  reg_no: z.string().regex(/^\d{2}\/[A-Z]{3}\d{3}$/i, { message: 'Registration number must match the format; YY/ABC000' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
}).required()

export const forgetPasswordSchema = z.object({
  reg_no: z.string().regex(/^\d{2}\/[A-Z]{3}\d{3}$/i, { message: 'Registration number must match the format; YY/ABC000' }),
  email: z.string().email({ message: 'Invalid email address' }),
}).required()

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirm_password: z.string()
    .min(6, { message: 'Confirm Password must be at least 6 characters' }),
}).required()
  .refine((data) => data.password === data.confirm_password, {
    message: "Password must match!",
    path: ['confirm_password']
  })
