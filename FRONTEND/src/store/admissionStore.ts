import { create } from 'zustand';
import admissionApi, { Admission, CreateAdmissionDto, UpdateAdmissionStatusDto } from '../services/api/admission.api';
import { sendAdmissionEmail } from '../utils/emailjs-service';

interface AdmissionState {
    admissions: Admission[];
    currentAdmission: Admission | null;
    loading: boolean;
    error: string | null;
    fetchAdmissions: (query?: any) => Promise<void>;
    fetchAdmission: (id: string) => Promise<Admission>;
    submitApplication: (data: CreateAdmissionDto) => Promise<Admission>;
    updateAdmissionStatus: (id: string, data: UpdateAdmissionStatusDto) => Promise<Admission>;
    deleteAdmission: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useAdmissionStore = create<AdmissionState>((set) => ({
    admissions: [],
    currentAdmission: null,
    loading: false,
    error: null,

    fetchAdmissions: async (query?: any) => {
        set({ loading: true, error: null });
        try {
            const admissions = await admissionApi.getAdmissions(query);
            set({ admissions, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch admissions',
                loading: false,
            });
        }
    },

    fetchAdmission: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const currentAdmission = await admissionApi.getAdmission(id);
            set({ currentAdmission, loading: false });
            return currentAdmission;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch admission details',
                loading: false,
            });
            throw error;
        }
    },

    submitApplication: async (data: CreateAdmissionDto) => {
        set({ loading: true, error: null });
        try {
            const admission = await admissionApi.submitPublicApplication(data);

            // Send EmailJS Application Received Email
            try {
                await sendAdmissionEmail({
                    studentName: data.studentName,
                    parentName: data.parentName,
                    email: data.email,
                    subject: 'Application Received - Sheikh Jeelani Islamic Academy',
                    message: `Thank you for submitting your application to Sheikh Jeelani Islamic Academy. We have successfully received the admission request and our team is currently reviewing it. We will get back to you soon with further updates.`,
                });
            } catch (emailError) {
                console.error("Failed to send Application Received email natively.", emailError);
            }

            set({ loading: false });
            return admission;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to submit application',
                loading: false,
            });
            throw error;
        }
    },

    updateAdmissionStatus: async (id: string, data: UpdateAdmissionStatusDto) => {
        set({ loading: true, error: null });
        try {
            const updatedAdmission = await admissionApi.updateStatus(id, data);

            // Send EmailJS Status Update Email
            try {
                if (['InterviewScheduled', 'Approved', 'Rejected'].includes(data.status)) {
                    let subject = 'Application Update - Sheikh Jeelani Islamic Academy';
                    let message = '';

                    switch (data.status) {
                        case 'InterviewScheduled':
                            subject = 'Interview Scheduled - Sheikh Jeelani Islamic Academy';
                            const dateStr = data.interviewDate
                                ? new Date(data.interviewDate).toLocaleDateString('en-IN', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit',
                                })
                                : 'To be confirmed';
                            message = `We are pleased to inform you that an interview has been scheduled for your application. Please be available on <strong>${dateStr}</strong>. <br><br> ${data.notes ? `<strong>Notes:</strong> ${data.notes}` : ''}`;
                            break;

                        case 'Approved':
                            subject = 'Application Approved - Sheikh Jeelani Islamic Academy';
                            message = `Congratulations! We are thrilled to inform you that your application has been approved. <br><br> ${data.notes ? `<strong>Notes:</strong> ${data.notes}` : ''}`;
                            break;

                        case 'Rejected':
                            subject = 'Application Update - Sheikh Jeelani Islamic Academy';
                            message = `Thank you for your interest in Sheikh Jeelani Islamic Academy. We have reviewed your application and, unfortunately, we are unable to offer admission at this time. <br><br> ${data.rejectionReason ? `<strong>Reason:</strong> ${data.rejectionReason}` : ''}`;
                            break;
                    }

                    if (message) {
                        await sendAdmissionEmail({
                            studentName: updatedAdmission.studentName,
                            parentName: updatedAdmission.parentName,
                            email: updatedAdmission.email,
                            subject: subject,
                            message: message,
                        });
                    }
                }
            } catch (emailError) {
                console.error("Failed to send admission update email.", emailError);
            }

            set((state) => ({
                admissions: state.admissions.map((a) =>
                    a._id === id ? updatedAdmission : a,
                ),
                currentAdmission:
                    state.currentAdmission?._id === id ? updatedAdmission : state.currentAdmission,
                loading: false,
            }));
            return updatedAdmission;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update status',
                loading: false,
            });
            throw error;
        }
    },

    deleteAdmission: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await admissionApi.deleteAdmission(id);
            set((state) => ({
                admissions: state.admissions.filter((a) => a._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete admission',
                loading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
