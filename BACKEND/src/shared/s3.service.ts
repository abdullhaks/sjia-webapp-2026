import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// Note: Kept class name as S3Service to avoid refactoring all injected dependencies
@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);

    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
        this.logger.log('Cloudinary configured successfully');
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'sjia'): Promise<string> {
        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: 'auto',
                        public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/\.[^/.]+$/, '')}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result!);
                    },
                );

                const readableStream = new Readable();
                readableStream.push(file.buffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });

            this.logger.log(`File uploaded to Cloudinary: ${result.secure_url}`);
            return result.secure_url;
        } catch (error: any) {
            this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteFile(fileUrl: string): Promise<boolean> {
        if (!fileUrl) return false;
        try {
            // Extract public_id from Cloudinary URL
            // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<ext>
            const publicId = this.extractPublicId(fileUrl);
            if (!publicId) {
                this.logger.warn(`Could not extract public_id from URL: ${fileUrl}`);
                return false;
            }

            const result = await cloudinary.uploader.destroy(publicId);
            this.logger.log(`Deleted Cloudinary resource: ${publicId}, result: ${result.result}`);
            return result.result === 'ok';
        } catch (error: any) {
            this.logger.error(`Failed to delete file from Cloudinary: ${error.message}`, error.stack);
            return false;
        }
    }

    getAllFiles(): any[] {
        // For Cloudinary, return empty array — media listing is handled via Cloudinary API
        // This method is used by the media manager, we'll implement it async via a separate method
        return [];
    }

    async getAllFilesAsync(): Promise<any[]> {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'sjia',
                max_results: 100,
                resource_type: 'image',
            });

            const imageFiles = result.resources.map((resource: any) => ({
                filename: resource.public_id.split('/').pop(),
                url: resource.secure_url,
                size: resource.bytes,
                createdAt: resource.created_at,
                folder: resource.folder || '/',
                format: resource.format,
                width: resource.width,
                height: resource.height,
            }));

            // Also get video resources
            const videoResult = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'sjia',
                max_results: 50,
                resource_type: 'video',
            });

            const videoFiles = videoResult.resources.map((resource: any) => ({
                filename: resource.public_id.split('/').pop(),
                url: resource.secure_url,
                size: resource.bytes,
                createdAt: resource.created_at,
                folder: resource.folder || '/',
                format: resource.format,
                width: resource.width,
                height: resource.height,
            }));

            const allFiles = [...imageFiles, ...videoFiles];
            return allFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (error: any) {
            this.logger.error(`Failed to list Cloudinary resources: ${error.message}`, error.stack);
            return [];
        }
    }

    private extractPublicId(url: string): string | null {
        try {
            // Handle Cloudinary URLs
            if (url.includes('res.cloudinary.com')) {
                const parts = url.split('/upload/');
                if (parts.length === 2) {
                    let publicIdWithExt = parts[1];
                    // Remove version prefix if present (e.g., v1234567890/)
                    publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
                    // Remove file extension
                    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
                    if (lastDotIndex !== -1) {
                        return publicIdWithExt.substring(0, lastDotIndex);
                    }
                    return publicIdWithExt;
                }
            }
            return null;
        } catch {
            return null;
        }
    }
}
