export declare class UploadService {
    private readonly uploadDir;
    constructor();
    getFileUrl(filename: string): string;
    processUploadedFiles(files: Express.Multer.File[]): string[];
    deleteFile(filename: string): boolean;
    deleteFiles(urls: string[]): void;
}
