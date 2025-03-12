import { z } from 'zod';

// User Schema
export const registerSchema = z.object({
  name: z.string()
    .min(3, { message: 'Name must be at least 3 characters' })
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




// Exam Schema
export const examSchema = z.object({
  title: z.string()
    .min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string()
    .max(256, { message: 'Description must be at most 128 characters' })
    .optional(),
  time_limit: z.coerce.number()
    .min(5, { message: 'Exam time must be at least 5 mins' })
    .max(180, { message: 'Exam time must be at most 180 mins' })
}).required()


// Question Schema
export const questionSchema = z.object({
  text: z.string()
    .min(3, { message: 'Question must be at least 3 characters' }),
  option1: z.string().min(1, { message: 'Option is required' }),
  option2: z.string().min(1, { message: 'Option is required' }),
  option3: z.string().optional(),
  option4: z.string().optional(),
  answer: z.string().min(1, { message: 'Option is required' }),
}).required()