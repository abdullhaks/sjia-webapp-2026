import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from './s3.service';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './schemas/notification.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
    ],
    controllers: [NotificationController],
    providers: [S3Service, NotificationService],
    exports: [S3Service, NotificationService, MongooseModule],
})
export class SharedModule { }
