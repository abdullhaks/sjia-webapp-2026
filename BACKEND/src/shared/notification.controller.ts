import {
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
    Request,
    Delete,
    Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    /**
     * GET /api/notifications/my
     * Fetches all notifications for the current user, newest first.
     */
    @Get('my')
    async getMyNotifications(@Request() req: any) {
        return this.notificationService.getNotificationsForUser(req.user.sub);
    }

    /**
     * GET /api/notifications/my/unread-count
     * Returns the count of unread notifications.
     */
    @Get('my/unread-count')
    async getUnreadCount(@Request() req: any) {
        return this.notificationService.getUnreadCount(req.user.sub);
    }

    /**
     * PATCH /api/notifications/:id/read
     * Marks a single notification as read.
     */
    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Request() req: any) {
        return this.notificationService.markAsRead(id, req.user.sub);
    }

    /**
     * PATCH /api/notifications/mark-all-read
     * Marks ALL notifications for the current user as read.
     */
    @Patch('mark-all-read')
    async markAllAsRead(@Request() req: any) {
        return this.notificationService.markAllAsRead(req.user.sub);
    }

    /**
     * DELETE /api/notifications/:id
     * Deletes a single notification for the current user.
     */
    @Delete(':id')
    async deleteNotification(@Param('id') id: string, @Request() req: any) {
        return this.notificationService.deleteNotification(id, req.user.sub);
    }
}
