/**
 * SJIA Email Templates for Frontend Serverless Functions
 * Reusable HTML email templates with SJIA branding
 */

const brandColors = {
    primary: '#075940',
    primaryLight: '#0a7a56',
    accent: '#d4af37',
    text: '#333333',
    lightBg: '#f8faf9',
    white: '#ffffff',
};

function wrapInLayout(bodyContent: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${brandColors.lightBg}; color: ${brandColors.text};">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${brandColors.lightBg}; padding: 32px 16px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: ${brandColors.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, ${brandColors.primary}, ${brandColors.primaryLight}); padding: 32px 40px; text-align: center;">
                                <h1 style="color: ${brandColors.white}; margin: 0 0 4px 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                                    Sheikh Jeelani Islamic Academy
                                </h1>
                                <p style="color: rgba(255,255,255,0.85); margin: 0; font-size: 13px; letter-spacing: 1px;">EXCELLENCE IN ISLAMIC EDUCATION</p>
                            </td>
                        </tr>
                        <!-- Islamic Greeting -->
                        <tr>
                            <td style="padding: 28px 40px 0 40px; text-align: center;">
                                <p style="font-size: 20px; color: ${brandColors.primary}; font-weight: 600; margin: 0 0 4px 0; direction: rtl;">
                                    السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ وَبَرَكاتُهُ
                                </p>
                                <p style="font-size: 14px; color: ${brandColors.primaryLight}; font-weight: 600; margin: 0;">
                                    Assalamu Alaikum wa Rahmatullahi wa Barakatuhu
                                </p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding: 24px 40px 32px 40px; line-height: 1.7; font-size: 15px; color: ${brandColors.text};">
                                ${bodyContent}
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: ${brandColors.lightBg}; padding: 24px 40px; border-top: 1px solid #e8ece9;">
                                <p style="margin: 0 0 4px 0; font-size: 13px; color: #666;">May Allah bless you and your family.</p>
                                <p style="margin: 0 0 2px 0; font-size: 14px; font-weight: 600; color: ${brandColors.primary};">Warm Regards,</p>
                                <p style="margin: 0 0 2px 0; font-size: 13px; color: #555;"><strong>Admissions Office</strong></p>
                                <p style="margin: 0; font-size: 12px; color: #888;">Sheikh Jeelani Islamic Academy, Mankery, Irimbiliyam, Malappuram, Kerala</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

/**
 * Thank you email sent after admission application is submitted
 */
export function applicationReceivedEmail(studentName: string, parentName: string): string {
    return wrapInLayout(`
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>Thank you for submitting an admission application to Sheikh Jeelani Islamic Academy for <strong>${studentName}</strong>.</p>
        <p>We have successfully received your application. Our admissions team will carefully review it and get back to you soon regarding the next steps, In Sha Allah.</p>
        <div style="background-color: ${brandColors.lightBg}; border-left: 4px solid ${brandColors.primary}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #555;">
                <strong>What happens next?</strong><br>
                Our team will review your application and contact you within 5-7 working days to schedule an interview or provide further instructions.
            </p>
        </div>
    `);
}

/**
 * Email sent when interview is scheduled
 */
export function interviewScheduledEmail(
    studentName: string,
    parentName: string,
    interviewDate: string,
    notes?: string,
): string {
    return wrapInLayout(`
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
    `);
}

/**
 * Email sent when application is approved
 */
export function applicationApprovedEmail(studentName: string, parentName: string, notes?: string): string {
    return wrapInLayout(`
        <p>Dear <strong>${parentName}</strong>,</p>
        <p>Alhamdulillah! We are delighted to inform you that the admission application for <strong>${studentName}</strong> has been <span style="color: ${brandColors.primary}; font-weight: 700;">Approved</span>.</p>
        <div style="background: linear-gradient(135deg, #eaf5ee, ${brandColors.lightBg}); border: 2px solid #2ecc71; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-size: 28px;">✅</p>
            <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: 700; color: #27ae60;">Application Approved</p>
        </div>
        ${notes ? `<p><strong>Note from Administration:</strong> ${notes}</p>` : ''}
        <p>Please visit the school office to complete the enrollment process within the next <strong>7 working days</strong>.</p>
    `);
}

/**
 * Email sent when application is rejected
 */
export function applicationRejectedEmail(
    studentName: string,
    parentName: string,
    rejectionReason?: string,
): string {
    return wrapInLayout(`
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
    `);
}
