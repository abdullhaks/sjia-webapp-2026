import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as webpush from 'web-push';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

export interface DualNotificationPayload {
    email?: string;
    emailSubject?: string;
    emailHtml?: string;
    pushSubscription?: any;
    pushPayload: {
        title: string;
        body: string;
        url?: string;
        icon?: string;
    };
    sendBoth?: boolean; // If true, sends both irrespective of push status
    recipientId?: string;
    type?: string;
}

@Injectable()
export class NotificationService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>
    ) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
                `mailto:${process.env.EMAIL_USER || 'admin@sjia.edu'}`,
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY
            );
        } else {
            this.logger.warn('VAPID keys not found. Push notifications disabled.');
        }
    }

    async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            this.logger.warn('Email credentials not configured. Skipping email send.');
            return false;
        }

        try {
            await this.transporter.sendMail({
                from: `"Sheikh Jeelani Islamic Academy" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`Email sent successfully to ${to}`);
            return true;
        } catch (error: any) {
            this.logger.error(`Error sending email to ${to}: ${error.message}`);
            return false;
        }
    }

    async sendPushNotification(subscription: any, payload: string): Promise<boolean> {
        if (!process.env.VAPID_PUBLIC_KEY || !subscription) return false;
        try {
            await webpush.sendNotification(subscription, payload);
            this.logger.log('Push notification sent successfully');
            return true;
        } catch (error: any) {
            this.logger.error(`Error sending push notification: ${error.message}`);
            // Often errors mean the subscription expired
            return false;
        }
    }

    /**
     * Unified dual notification engine.
     * Attempts to send a push notification first. If it fails or is unavailable, falls back to Email (unless sendBoth is true).
     * Saves the notification to the database if recipientId is provided.
     */
    async sendDualNotification(payload: DualNotificationPayload): Promise<void> {
        let pushSuccess = false;

        // 1. Save to Database
        if (payload.recipientId) {
            try {
                await this.notificationModel.create({
                    recipient: new Types.ObjectId(payload.recipientId),
                    title: payload.pushPayload.title,
                    message: payload.pushPayload.body,
                    type: payload.type || 'INFO',
                    url: payload.pushPayload.url,
                });
            } catch (error: any) {
                this.logger.error(`Failed to save notification to DB: ${error.message}`);
            }
        }

        // 2. Push Notification
        if (payload.pushSubscription) {
            pushSuccess = await this.sendPushNotification(
                payload.pushSubscription,
                JSON.stringify(payload.pushPayload)
            );
        }

        // 3. Email Fallback
        if ((!pushSuccess || payload.sendBoth) && payload.email && payload.emailSubject && payload.emailHtml) {
            await this.sendEmail(payload.email, payload.emailSubject, payload.emailHtml);
        }
    }

    /**
     * Broadcast a notification to multiple recipients (e.g. when a notice is posted).
     * Creates DB notification entries for each recipientId provided.
     */
    async broadcastNotification(
        recipientIds: string[],
        title: string,
        message: string,
        type: string = 'INFO',
        url?: string,
    ): Promise<void> {
        if (!recipientIds || recipientIds.length === 0) return;

        try {
            const docs = recipientIds.map((id) => ({
                recipient: new Types.ObjectId(id),
                title,
                message,
                type,
                url,
                isRead: false,
            }));
            await this.notificationModel.insertMany(docs);
            this.logger.log(`Broadcast notification "${title}" to ${recipientIds.length} recipients`);
        } catch (error: any) {
            this.logger.error(`Failed to broadcast notification: ${error.message}`);
        }
    }

    // ─── User-Facing Notification Queries ───────────────────────────────

    /**
     * Get all notifications for a specific user, newest first.
     */
    async getNotificationsForUser(userId: string) {
        return this.notificationModel
            .find({ recipient: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean()
            .exec();
    }

    /**
     * Get count of unread notifications for a user.
     */
    async getUnreadCount(userId: string): Promise<{ count: number }> {
        const count = await this.notificationModel.countDocuments({
            recipient: new Types.ObjectId(userId),
            isRead: false,
        });
        return { count };
    }

    /**
     * Mark a single notification as read.
     */
    async markAsRead(notificationId: string, userId: string) {
        return this.notificationModel.findOneAndUpdate(
            { _id: notificationId, recipient: new Types.ObjectId(userId) },
            { isRead: true },
            { new: true },
        );
    }

    /**
     * Mark ALL notifications for a user as read.
     */
    async markAllAsRead(userId: string) {
        await this.notificationModel.updateMany(
            { recipient: new Types.ObjectId(userId), isRead: false },
            { isRead: true },
        );
        return { message: 'All notifications marked as read' };
    }

    /**
     * Delete a single notification.
     */
    async deleteNotification(notificationId: string, userId: string) {
        await this.notificationModel.findOneAndDelete({
            _id: notificationId,
            recipient: new Types.ObjectId(userId),
        });
        return { message: 'Notification deleted' };
    }
}
