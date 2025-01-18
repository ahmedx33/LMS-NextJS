import { z } from "zod";


export const signUpSchema = z.object({
    username: z.string().min(5, { message: "Username must be at least 4 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
});

export type SignUpFormType = z.infer<typeof signUpSchema>;