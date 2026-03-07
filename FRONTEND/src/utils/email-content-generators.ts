/**
 * Frontend EmailJS Content Generators
 * Generates the specific HTML body content to be injected into the {{{message}}} 
 * area of the common EmailJS template for admission emails.
 */

const brandColors = {
    primary: '#075940',
    primaryLight: '#0a7a56',
    accent: '#d4af37',
    text: '#333333',
    lightBg: '#f8faf9',
    white: '#ffffff',
};

/**
 * Thank you email body content sent after admission application is submitted
 */
export function generateApplicationReceivedContent(studentName: string, parentName: string): string {
    return `
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>Thank you for submitting an admission application to Sheikh Jeelani Islamic Academy for <strong>${studentName}</strong>.</p>
        <p>We have successfully received your application. Our admissions team will carefully review it and get back to you soon regarding the next steps, In Sha Allah.</p>
        <div style="background-color: ${brandColors.lightBg}; border-left: 4px solid ${brandColors.primary}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">
                <strong>What happens next?</strong><br>
                Our team will review your application and contact you within 5-7 working days to schedule an interview or provide further instructions.
            </p>
        </div>
    `;
}

/**
 * Email body content sent when interview is scheduled
 */
export function generateInterviewScheduledContent(
    studentName: string,
    parentName: string,
    interviewDate: string,
    notes?: string,
): string {
    return `
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>We are pleased to inform you that the admission application for <strong>${studentName}</strong> has been reviewed, and we would like to invite you for an interview at our campus.</p>
        <div style="background: linear-gradient(135deg, ${brandColors.lightBg}, #eef5f0); border: 2px solid ${brandColors.primary}; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Interview Scheduled</p>
            <p style="margin: 0; font-size: 22px; font-weight: 700; color: ${brandColors.primary};">
                📅 ${interviewDate}
            </p>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #666;">at Sheikh Jeelani Islamic Academy Campus</p>
        </div>
        ${notes ? `<p><strong>Note from Administration:</strong> ${notes}</p>` : ''}
        <p>Please bring the following documents:</p>
        <ul style="padding-left: 20px; color: #555;">
            <li>Previous academic records</li>
            <li>ID proof of parent/guardian</li>
            <li>Passport-size photographs (2 copies)</li>
        </ul>
        <p>If you need to reschedule, please contact our admissions office at your earliest convenience.</p>
    `;
}

/**
 * Email body content sent when application is approved
 */
export function generateApplicationApprovedContent(studentName: string, parentName: string, notes?: string): string {
    return `
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>Alhamdulillah! We are delighted to inform you that the admission application for <strong>${studentName}</strong> has been <span style="color: ${brandColors.primary}; font-weight: 700;">Approved</span>.</p>
        <div style="background: linear-gradient(135deg, #eaf5ee, ${brandColors.lightBg}); border: 2px solid #2ecc71; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 28px;">✅</p>
            <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: 700; color: #27ae60;">Application Approved</p>
        </div>
        ${notes ? `<p><strong>Note from Administration:</strong> ${notes}</p>` : ''}
        <p>Please visit the school office to complete the enrollment process within the next <strong>7 working days</strong>.</p>
    `;
}

/**
 * Email body content sent when application is rejected
 */
export function generateApplicationRejectedContent(
    studentName: string,
    parentName: string,
    rejectionReason?: string,
): string {
    return `
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>Thank you for your interest in Sheikh Jeelani Islamic Academy. We have carefully reviewed the admission application for <strong>${studentName}</strong>.</p>
        <p>We regret to inform you that we are unable to offer admission at this time.</p>
        ${rejectionReason
            ? `<div style="background-color: #fef5f5; border-left: 4px solid #e74c3c; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #555;">
                    <strong>Reason:</strong> ${rejectionReason}
                </p>
            </div>`
            : ''
        }
        <p>We encourage you to apply again in the future. If you have any questions, please do not hesitate to contact our admissions office.</p>
        <p>We wish you and your family all the best.</p>
    `;
}
