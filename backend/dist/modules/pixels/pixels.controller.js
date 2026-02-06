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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixelsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const pixels_service_1 = require("./pixels.service");
const update_pixels_dto_1 = require("./dto/update-pixels.dto");
let PixelsController = class PixelsController {
    constructor(pixelsService) {
        this.pixelsService = pixelsService;
    }
    getPixels(req, storeId) {
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.pixelsService.getPixels(storeId, workspaceId);
    }
    updatePixels(req, storeId, dto) {
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.pixelsService.updatePixels(storeId, workspaceId, dto);
    }
    testPixel(req, storeId, pixelType) {
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.pixelsService.testPixel(storeId, workspaceId, pixelType);
    }
};
exports.PixelsController = PixelsController;
__decorate([
    (0, common_1.Get)(':storeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PixelsController.prototype, "getPixels", null);
__decorate([
    (0, common_1.Patch)(':storeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_pixels_dto_1.UpdatePixelsDto]),
    __metadata("design:returntype", void 0)
], PixelsController.prototype, "updatePixels", null);
__decorate([
    (0, common_1.Post)(':storeId/test'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PixelsController.prototype, "testPixel", null);
exports.PixelsController = PixelsController = __decorate([
    (0, common_1.Controller)('pixels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [pixels_service_1.PixelsService])
], PixelsController);
//# sourceMappingURL=pixels.controller.js.map