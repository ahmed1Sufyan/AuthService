import { FileData, FileStorage } from '../types/storage';
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { configDotenv } from 'dotenv';
configDotenv();
export class S3Storage implements FileStorage {
    private client: S3Client;
    constructor() {
        this.client = new S3Client({
            region: process.env.aws_region,
            credentials: {
                accessKeyId: process.env.aws_access_key!,
                secretAccessKey: process.env.aws_secrect_access_key!,
            },
        });
    }
    async uploadFile(data: FileData) {
        const objectparams = {
            Bucket: process.env.aws_bucket_name!,
            Key: `${data.filename}`,
            Body: new Uint8Array(data.fileData),
        };
        try {
            await this.client.send(new PutObjectCommand(objectparams));
            return data.filename;
        } catch (error) {
            console.error(error);
            return '';
        }
    }
    async deleteFile(filename: string) {
        const deleteParams = {
            Bucket: process.env.aws_bucket_name!,
            Key: filename,
        };

        try {
            await this.client.send(new DeleteObjectCommand(deleteParams));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    getObjectUrl(filename: string): string {
        return `https://${process.env.aws_bucket_name}.s3.${process.env.aws_region}.amazonaws.com/${filename}`;
    }
}
