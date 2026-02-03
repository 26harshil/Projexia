// /lib/email.ts
"use server";

import nodemailer from "nodemailer";

// Configure transporter - using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}

export async function sendEmail(options: EmailOptions) {
    try {
        // Skip email sending if SMTP is not configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.log("[Email] SMTP not configured, skipping email send");
            console.log("[Email] Would have sent to:", options.to);
            console.log("[Email] Subject:", options.subject);
            return { success: true, skipped: true };
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log("[Email] Sent successfully to:", options.to);
        return { success: true };
    } catch (error) {
        console.error("[Email] Error sending email:", error);
        return { success: false, error: String(error) };
    }
}

// Meeting notification email template
export async function sendMeetingNotification({
    studentEmails,
    meetingDetails,
}: {
    studentEmails: string[];
    meetingDetails: {
        datetime: Date;
        purpose: string;
        location: string | null;
        groupName: string;
        facultyName: string;
    };
}) {
    const dateStr = new Date(meetingDetails.datetime).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
    });

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
                .meeting-card { background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                .detail-label { font-weight: 600; color: #64748b; width: 100px; }
                .detail-value { color: #1e293b; flex: 1; }
                .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0;">📅 New Meeting Scheduled</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Student Project Management System</p>
                </div>
                <div class="content">
                    <p>Dear Student,</p>
                    <p>A new meeting has been scheduled for your project group. Please find the details below:</p>
                    
                    <div class="meeting-card">
                        <div class="detail-row">
                            <span class="detail-label">📁 Group</span>
                            <span class="detail-value">${meetingDetails.groupName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">📋 Purpose</span>
                            <span class="detail-value">${meetingDetails.purpose}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">🗓️ Date & Time</span>
                            <span class="detail-value">${dateStr}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">📍 Location</span>
                            <span class="detail-value">${meetingDetails.location || "To be announced"}</span>
                        </div>
                        <div class="detail-row" style="border: none;">
                            <span class="detail-label">👤 Faculty</span>
                            <span class="detail-value">${meetingDetails.facultyName}</span>
                        </div>
                    </div>
                    
                    <p>Please ensure your attendance and come prepared with your project updates.</p>
                    <p>Best regards,<br><strong>SPMS Team</strong></p>
                </div>
                <div class="footer">
                    <p>This is an automated notification from SPMS. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const text = `
New Meeting Scheduled

Group: ${meetingDetails.groupName}
Purpose: ${meetingDetails.purpose}
Date & Time: ${dateStr}
Location: ${meetingDetails.location || "To be announced"}
Faculty: ${meetingDetails.facultyName}

Please ensure your attendance and come prepared with your project updates.

Best regards,
SPMS Team
    `;

    return sendEmail({
        to: studentEmails,
        subject: `📅 Meeting Scheduled: ${meetingDetails.purpose} - ${meetingDetails.groupName}`,
        html,
        text,
    });
}
