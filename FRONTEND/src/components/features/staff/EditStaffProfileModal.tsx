import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa';
import axiosInstance from '../../../services/axios/authAxios';
import { useStaffStore } from '../../../store/staffStore';

const staffProfileSchema = z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    email: z.string().email('Invalid email address'),
    qualification: z.string().optional(),
    address: z.string().min(5, 'Address is too short'),
});

type StaffProfileForm = z.infer<typeof staffProfileSchema>;

interface EditStaffProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStaff: any;
}

const EditStaffProfileModal: React.FC<EditStaffProfileModalProps> = ({ isOpen, onClose, currentStaff }) => {
    const { fetchCurrentStaff } = useStaffStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(currentStaff.photoUrl);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<StaffProfileForm>({
        resolver: zodResolver(staffProfileSchema),
        defaultValues: {
            phone: currentStaff.phone,
            email: currentStaff.email,
            qualification: currentStaff.qualification,
            address: currentStaff.address,
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: StaffProfileForm) => {
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            if (data.qualification) formData.append('qualification', data.qualification);
            formData.append('address', data.address);
            if (selectedImage) {
                formData.append('file', selectedImage);
            }

            await axiosInstance.patch('/staff/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await fetchCurrentStaff();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <FaTimes className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img
                                    src={previewImage || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                                />
                                <label className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-sm">
                                    <FaCamera size={14} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input {...register('email')} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input {...register('phone')} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                <input {...register('qualification')} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea {...register('address')} rows={3} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
                                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex justify-center items-center gap-2 disabled:opacity-70">
                                {isSubmitting && <FaSpinner className="animate-spin" />} Save Changes
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditStaffProfileModal;
