import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ContentManagementService } from './content-management.service';
import { ContentManagementController } from './content-management.controller';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { Leadership, LeadershipSchema } from './schemas/leadership.schema';
import { SiteContent, SiteContentSchema } from './schemas/site-content.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: GallerySchema },
      { name: Leadership.name, schema: LeadershipSchema },
      { name: SiteContent.name, schema: SiteContentSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [ContentManagementController],
  providers: [ContentManagementService],
  exports: [ContentManagementService],
})
export class ContentManagementModule { }
