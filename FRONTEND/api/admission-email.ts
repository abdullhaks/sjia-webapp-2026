import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import {
    applicationReceivedEmail,
    interviewScheduledEmail,
    applicationApprovedEmail,
    applicationRejectedEmail,
} from '../src/utils/email-templates';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { type, email, studentName, parentName, data } = req.body;

    // Validate required fields
    if (!type || !email || !studentName || !parentName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Configure Nodemailer transporter options (reusing existing env vars)
    if (!process.env.VITE_EMAIL_USER || !process.env.VITE_EMAIL_PASS) {
        console.warn('Email credentials not configured.');
        return res.status(500).json({ message: 'Email credentials not configured.' });
    }

    

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VITE_EMAIL_USER,
            pass: process.env.VITE_EMAIL_PASS,
        },
    });

    let emailHtml = '';
    let subject = '';

    try {
        switch (type) {
            case 'received':
                emailHtml = applicationReceivedEmail(studentName, parentName);
                subject = 'Application Received - Sheikh Jeelani Islamic Academy';
                break;

            case 'InterviewScheduled':
                const dateStr = data?.interviewDate
                    ? new Date(data.interviewDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                    : 'To be confirmed';
                emailHtml = interviewScheduledEmail(
                    studentName,
                    parentName,
                    dateStr,
                    data?.notes,
                );
                subject = 'Interview Scheduled - Sheikh Jeelani Islamic Academy';
                break;

            case 'Approved':
                emailHtml = applicationApprovedEmail(
                    studentName,
                    parentName,
                    data?.notes,
                );
                subject = 'Application Approved - Sheikh Jeelani Islamic Academy';
                break;

            case 'Rejected':
                emailHtml = applicationRejectedEmail(
                    studentName,
                    parentName,
                    data?.rejectionReason,
                );
                subject = 'Application Update - Sheikh Jeelani Islamic Academy';
                break;

            default:
                return res.status(400).json({ message: 'Invalid email type' });
        }

        if (emailHtml && subject) {
            await transporter.sendMail({
                from: `"Sheikh Jeelani Islamic Academy" <${process.env.VITE_EMAIL_USER}>`,
                to: email,
                subject,
                html: emailHtml,
            });
            return res.status(200).json({ message: 'Email sent successfully' });
        } else {
            return res.status(400).json({ message: 'Failed to construct email' });
        }

    } catch (error: any) {
        console.error('Error sending email:', error.message);
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
}
