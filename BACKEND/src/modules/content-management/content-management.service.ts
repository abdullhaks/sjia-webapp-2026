import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { Leadership, LeadershipDocument } from './schemas/leadership.schema';
import { SiteContent, SiteContentDocument } from './schemas/site-content.schema';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { CreateLeadershipDto, UpdateLeadershipDto } from './dto/leadership.dto';
import { UpdateSiteContentDto } from './dto/site-content.dto';
import { S3Service } from '../../shared/s3.service';

@Injectable()
export class ContentManagementService {
    constructor(
        @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
        @InjectModel(Leadership.name) private leadershipModel: Model<LeadershipDocument>,
        @InjectModel(SiteContent.name) private siteContentModel: Model<SiteContentDocument>,
        private readonly s3Service: S3Service,
    ) { }

    // Gallery Methods
    async createGallery(createGalleryDto: CreateGalleryDto, userId: string): Promise<Gallery> {
        const gallery = new this.galleryModel({
            ...createGalleryDto,
            uploadedBy: userId,
        });
        return gallery.save();
    }

    async findAllGallery(filters?: any): Promise<Gallery[]> {
        const query = filters || {};
        return this.galleryModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
    }

    async findOneGallery(id: string): Promise<Gallery | null> {
        return this.galleryModel.findById(id).exec();
    }

    async updateGallery(id: string, updateGalleryDto: UpdateGalleryDto): Promise<Gallery | null> {
        const existing = await this.galleryModel.findById(id).exec();
        if (updateGalleryDto.imageUrl && existing?.imageUrl && updateGalleryDto.imageUrl !== existing.imageUrl) {
            await this.s3Service.deleteFile(existing.imageUrl);
        }
        return this.galleryModel.findByIdAndUpdate(id, updateGalleryDto, { new: true }).exec();
    }

    async removeGallery(id: string): Promise<void> {
        const existing = await this.galleryModel.findById(id).exec();
        if (existing?.imageUrl) {
            await this.s3Service.deleteFile(existing.imageUrl);
        }
        await this.galleryModel.findByIdAndDelete(id).exec();
    }

    // Leadership Methods
    async createLeadership(createLeadershipDto: CreateLeadershipDto): Promise<Leadership> {
        const leadership = new this.leadershipModel(createLeadershipDto);
        return leadership.save();
    }

    async findAllLeadership(): Promise<Leadership[]> {
        return this.leadershipModel.find().sort({ order: 1 }).exec();
    }

    async findOneLeadership(id: string): Promise<Leadership | null> {
        return this.leadershipModel.findById(id).exec();
    }

    async updateLeadership(id: string, updateLeadershipDto: UpdateLeadershipDto): Promise<Leadership | null> {
        const existing = await this.leadershipModel.findById(id).exec();
        if (updateLeadershipDto.photoUrl && existing?.photoUrl && updateLeadershipDto.photoUrl !== existing.photoUrl) {
            await this.s3Service.deleteFile(existing.photoUrl);
        }
        return this.leadershipModel.findByIdAndUpdate(id, updateLeadershipDto, { new: true }).exec();
    }

    async removeLeadership(id: string): Promise<void> {
        const existing = await this.leadershipModel.findById(id).exec();
        if (existing?.photoUrl) {
            await this.s3Service.deleteFile(existing.photoUrl);
        }
        await this.leadershipModel.findByIdAndDelete(id).exec();
    }

    // Site Content Methods
    async findAllSiteContent(): Promise<SiteContent[]> {
        return this.siteContentModel.find().sort({ section: 1, key: 1 }).exec();
    }

    async findSiteContentByKey(key: string): Promise<SiteContent | null> {
        return this.siteContentModel.findOne({ key }).exec();
    }

    async updateSiteContent(key: string, updateSiteContentDto: UpdateSiteContentDto, userId: string): Promise<SiteContent | null> {
        const existing = await this.siteContentModel.findOne({ key }).exec();

        // If it looks like we're replacing a file URL with a different one
        if (existing?.value && typeof existing.value === 'string' &&
            (existing.value.includes('/uploads/') || existing.value.includes('res.cloudinary.com'))) {
            if (updateSiteContentDto.value !== existing.value) {
                await this.s3Service.deleteFile(existing.value);
            }
        }

        return this.siteContentModel.findOneAndUpdate(
            { key },
            { ...updateSiteContentDto, updatedBy: userId },
            { new: true, upsert: true }
        ).exec();
    }
}
