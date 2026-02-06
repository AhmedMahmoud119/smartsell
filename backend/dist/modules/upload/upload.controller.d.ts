import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadSingleImage(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
    };
    uploadMultipleImages(files: Express.Multer.File[]): {
        urls: string[];
        files: {
            url: string;
            filename: string;
            originalName: string;
            size: number;
        }[];
    };
    deleteImage(url: string): {
        success: boolean;
    };
}
