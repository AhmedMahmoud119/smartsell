"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let UploadService = class UploadService {
    constructor() {
        this.uploadDir = './uploads';
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
    }
    getFileUrl(filename) {
        return `/uploads/${filename}`;
    }
    processUploadedFiles(files) {
        return files.map((file) => this.getFileUrl(file.filename));
    }
    deleteFile(filename) {
        try {
            const filePath = (0, path_1.join)(this.uploadDir, filename);
            if ((0, fs_1.existsSync)(filePath)) {
                (0, fs_1.unlinkSync)(filePath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
    deleteFiles(urls) {
        urls.forEach((url) => {
            const filename = url.split('/').pop();
            if (filename) {
                this.deleteFile(filename);
            }
        });
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map