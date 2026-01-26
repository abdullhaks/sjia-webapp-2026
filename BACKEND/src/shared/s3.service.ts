import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly logger = new Logger(S3Service.name);
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'sjia';
        const region = this.configService.get<string>('AWS_REGION') || 'ap-south-1';

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'sjia'): Promise<string> {
        try {
            const fileName = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read', // Ensure bucket allows public read or use signed URLs (for this task assuming public read or bucket policy handles it)
                }),
            );

            // Construct public URL (adjust based on your region/bucket/cloud settings)
            // Ideally, use a CDN or just the S3 URL
            const region = this.configService.get<string>('AWS_REGION') || 'ap-south-1';
            const url = `https://${this.bucketName}.s3.${region}.amazonaws.com/${fileName}`;

            return url;
        } catch (error) {
            this.logger.error(`Failed to upload file to S3: ${error.message}`, error.stack);
            throw error;
        }
    }
}
