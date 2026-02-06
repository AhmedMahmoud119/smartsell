import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = './uploads';

  constructor() {
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Get the full URL path for an uploaded file
   */
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  /**
   * Process multiple uploaded files and return their URLs
   */
  processUploadedFiles(files: Express.Multer.File[]): string[] {
    return files.map((file) => this.getFileUrl(file.filename));
  }

  /**
   * Delete an uploaded file
   */
  deleteFile(filename: string): boolean {
    try {
      const filePath = join(this.uploadDir, filename);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Delete multiple files from URLs
   */
  deleteFiles(urls: string[]): void {
    urls.forEach((url) => {
      const filename = url.split('/').pop();
      if (filename) {
        this.deleteFile(filename);
      }
    });
  }
}
