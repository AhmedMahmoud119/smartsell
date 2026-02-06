import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      url: this.uploadService.getFileUrl(file.filename),
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return {
      urls: this.uploadService.processUploadedFiles(files),
      files: files.map((file) => ({
        url: this.uploadService.getFileUrl(file.filename),
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      })),
    };
  }

  @Delete('image')
  deleteImage(@Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('URL is required');
    }
    const filename = url.split('/').pop();
    if (filename) {
      const deleted = this.uploadService.deleteFile(filename);
      return { success: deleted };
    }
    return { success: false };
  }
}
