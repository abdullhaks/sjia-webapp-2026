import { z } from 'zod';

export const superAdminLoginSchema = z.object({
    identifier: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password must not exceed 50 characters'),
    rememberMe: z.boolean().optional(),
});

export const staffStudentLoginSchema = z.object({
    identifier: z
        .string()
        .min(1, 'Email or Phone is required')
        .refine((val) => {
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            const isPhone = /^\+?[\d\s-]{10,}$/.test(val);
            return isEmail || isPhone;
        }, 'Please enter a valid email or phone number'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(50, 'Password must not exceed 50 characters'),
    rememberMe: z.boolean().optional(),
});

export type SuperAdminLoginFormData = z.infer<typeof superAdminLoginSchema>;
export type StaffStudentLoginFormData = z.infer<typeof staffStudentLoginSchema>;
