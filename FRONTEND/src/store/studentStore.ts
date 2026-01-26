import { create } from 'zustand';
import studentApi, { Student, CreateStudentDto, UpdateStudentDto } from '../services/api/student.api';

interface StudentState {
    students: Student[];
    councilMembers: Student[];
    currentStudent: Student | null;
    loading: boolean;
    error: string | null;
    fetchStudents: (query?: any) => Promise<void>;
    fetchCouncilMembers: () => Promise<void>;
    fetchCurrentStudent: () => Promise<Student>;
    createStudent: (data: CreateStudentDto | FormData) => Promise<Student>;
    updateStudent: (id: string, data: UpdateStudentDto | FormData) => Promise<Student>;
    deleteStudent: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
    students: [],
    councilMembers: [],
    currentStudent: null,
    loading: false,
    error: null,

    fetchStudents: async (query?: any) => {
        set({ loading: true, error: null });
        try {
            const students = await studentApi.getStudents(query);
            set({ students, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch students',
                loading: false,
            });
        }
    },

    fetchCouncilMembers: async () => {
        set({ loading: true, error: null });
        try {
            const councilMembers = await studentApi.getCouncilMembers();
            set({ councilMembers, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch council members',
                loading: false,
            });
        }
    },

    fetchCurrentStudent: async () => {
        set({ loading: true, error: null });
        try {
            const currentStudent = await studentApi.getCurrentStudent();
            set({ currentStudent, loading: false });
            return currentStudent;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch student profile',
                loading: false,
            });
            throw error;
        }
    },

    createStudent: async (data: CreateStudentDto | FormData) => {
        set({ loading: true, error: null });
        try {
            const newStudent = await studentApi.createStudent(data);
            set((state) => ({
                students: [...state.students, newStudent],
                loading: false,
            }));
            return newStudent;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create student',
                loading: false,
            });
            throw error;
        }
    },

    updateStudent: async (id: string, data: UpdateStudentDto | FormData) => {
        set({ loading: true, error: null });
        try {
            const updatedStudent = await studentApi.updateStudent(id, data);
            set((state) => ({
                students: state.students.map((s) =>
                    s._id === id ? updatedStudent : s
                ),
                loading: false,
            }));
            return updatedStudent;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update student',
                loading: false,
            });
            throw error;
        }
    },

    deleteStudent: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await studentApi.deleteStudent(id);
            set((state) => ({
                students: state.students.filter((s) => s._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete student',
                loading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
