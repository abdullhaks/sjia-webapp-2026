import { z } from 'zod';

export const staffSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string()
        .length(10, 'Phone number must be exactly 10 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),

    designation: z.string().min(1, 'Designation is required'),
    department: z.string().optional(),
    joiningDate: z.any().refine((val) => val, 'Joining date is required'),
    qualification: z.string().optional(),
    experience: z.string().optional(),
    salary: z.number().optional(),

    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pincode: z.string()
        .length(6, 'Pincode must be exactly 6 digits')
        .regex(/^[0-9]+$/, 'Pincode must contain only digits'),

    status: z.enum(['Active', 'Resigned', 'Terminated', 'Retired', 'On Leave']).optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
