import { z } from 'zod';

const BaseUserSchema = z.object({
  email: z.email().max(100, "Email cannot be longer than 100 characters"),
  password: z.string().min(6).max(100, "Password must be between 6 and 100 characters")
});

const RegisterUserSchema = BaseUserSchema.extend({
  name: z.string()
    .min(1, "Name must be at least 1 character long")
    .max(25, "Name cannot be longer than 25 characters")
    .regex(/^[a-zA-Z]+$/, "Name can only contain alphabetic characters"),
});

type RegisterUserType = z.infer<typeof RegisterUserSchema>;

export { RegisterUserType, RegisterUserSchema, BaseUserSchema };


