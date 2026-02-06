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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const assign_product_dto_1 = require("./dto/assign-product.dto");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    create(req, createProductDto) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.create(userId, workspaceId, createProductDto);
    }
    findAll(req, storeId, status) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.findAll(userId, workspaceId, storeId, status);
    }
    findOne(req, id) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.findOne(userId, workspaceId, id);
    }
    update(req, id, updateProductDto) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.update(userId, workspaceId, id, updateProductDto);
    }
    delete(req, id) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.delete(userId, workspaceId, id);
    }
    bulkUpdateStatus(req, body) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.bulkUpdateStatus(userId, workspaceId, body.productIds, body.status);
    }
    getUnassignedProducts(req) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.getUnassignedProducts(userId, workspaceId);
    }
    assignToStore(req, id, assignProductDto) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.assignToStore(userId, workspaceId, id, assignProductDto.storeId);
    }
    unassignFromStore(req, id) {
        const userId = req.user.id;
        const workspaceId = req.user.workspaces[0]?.workspace.id;
        return this.productService.unassignFromStore(userId, workspaceId, id);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('storeId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('bulk-update-status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Get)('unassigned/list'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getUnassignedProducts", null);
__decorate([
    (0, common_1.Post)(':id/assign-store'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, assign_product_dto_1.AssignProductDto]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "assignToStore", null);
__decorate([
    (0, common_1.Delete)(':id/unassign-store'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "unassignFromStore", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map