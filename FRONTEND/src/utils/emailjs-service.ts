import emailjs from '@emailjs/browser';

interface EmailTemplateParams {
    studentName: string;
    parentName: string;
    email: string;
    subject: string;
    message: string;
}

export const sendAdmissionEmail = async (params: EmailTemplateParams): Promise<boolean> => {
    try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_USER_ID;

        if (!serviceId || !templateId || !publicKey) {
            console.error('EmailJS credentials are not fully configured in environment variables.');
            return false;
        }

        const templateParams = {
            subject: params.subject,
            studentName: params.studentName,
            parentName: params.parentName,
            to_email: params.email,
            message: params.message,
        };

        const response = await emailjs.send(serviceId, templateId, templateParams, {
            publicKey: publicKey,
        });

        console.log('Email sent successfully!', response.status, response.text);
        return true;
    } catch (error) {
        console.error('Failed to send EmailJS email:', error);
        return false;
    }
};
