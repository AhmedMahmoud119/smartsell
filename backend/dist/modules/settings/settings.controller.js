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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const settings_service_1 = require("./settings.service");
const update_currencies_dto_1 = require("./dto/update-currencies.dto");
const create_currency_dto_1 = require("./dto/create-currency.dto");
const update_currency_dto_1 = require("./dto/update-currency.dto");
let SettingsController = class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getAllCurrencies(req) {
        return this.settingsService.getAllCurrencies(req.user.userId, req.user.workspaceId);
    }
    createCurrency(req, dto) {
        return this.settingsService.createCurrency(req.user.userId, req.user.workspaceId, dto);
    }
    updateCurrency(req, currencyId, dto) {
        return this.settingsService.updateCurrency(req.user.userId, req.user.workspaceId, currencyId, dto);
    }
    deleteCurrency(req, currencyId) {
        return this.settingsService.deleteCurrency(req.user.userId, req.user.workspaceId, currencyId);
    }
    getStoreCurrencies(req, storeId) {
        return this.settingsService.getStoreCurrencies(req.user.userId, req.user.workspaceId, storeId);
    }
    updateStoreCurrencies(req, storeId, dto) {
        return this.settingsService.updateStoreCurrencies(req.user.userId, req.user.workspaceId, storeId, dto);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('currencies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAllCurrencies", null);
__decorate([
    (0, common_1.Post)('currencies'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_currency_dto_1.CreateCurrencyDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "createCurrency", null);
__decorate([
    (0, common_1.Put)('currencies/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_currency_dto_1.UpdateCurrencyDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateCurrency", null);
__decorate([
    (0, common_1.Delete)('currencies/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "deleteCurrency", null);
__decorate([
    (0, common_1.Get)('stores/:storeId/currencies'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getStoreCurrencies", null);
__decorate([
    (0, common_1.Put)('stores/:storeId/currencies'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('storeId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_currencies_dto_1.UpdateCurrenciesDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateStoreCurrencies", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map