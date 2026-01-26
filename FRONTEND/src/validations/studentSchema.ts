import { z } from 'zod';

export const studentSchema = z.object({
    admissionNumber: z.string().min(1, 'Admission number is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.any().refine((val) => val, 'Date of birth is required'),
    dateOfAdmission: z.any().refine((val) => val, 'Date of admission is required'),
    gender: z.enum(['Male', 'Female'], { errorMap: () => ({ message: 'Gender is required' }) }),
    bloodGroup: z.string().optional(),

    // Contact
    phone: z.string()
        .length(10, 'Phone number must be exactly 10 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string()
        .length(6, 'Pincode must be exactly 6 digits')
        .regex(/^[0-9]+$/, 'Pincode must contain only digits'),

    // Guardian
    guardianName: z.string().min(1, 'Guardian name is required'),
    guardianRelation: z.string().optional(),
    guardianPhone: z.string()
        .length(10, 'Guardian phone must be exactly 10 digits')
        .regex(/^[0-9]+$/, 'Guardian phone must contain only digits'),

    // Academic
    program: z.string().min(1, 'Program is required'),
    batch: z.string().min(1, 'Batch is required'),
    currentClass: z.string().min(1, 'Current class is required'),

    status: z.enum(['Active', 'Graduated', 'Suspended', 'Left']).optional(),
    councilPosition: z.string().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
