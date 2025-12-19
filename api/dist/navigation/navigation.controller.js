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
exports.NavigationController = void 0;
const common_1 = require("@nestjs/common");
const navigation_service_1 = require("./navigation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let NavigationController = class NavigationController {
    navigationService;
    constructor(navigationService) {
        this.navigationService = navigationService;
    }
    async getNavigationItems(query) {
        const items = await this.navigationService.getNavigationItems(query);
        return { success: true, data: items, total: items.length };
    }
    async getNavigationTree() {
        const tree = await this.navigationService.getNavigationTree();
        return { success: true, data: tree };
    }
    async getNavigationItem(id) {
        const item = await this.navigationService.getNavigationItemById(id);
        return { success: true, data: item };
    }
    async createNavigationItem(body) {
        const item = await this.navigationService.createNavigationItem(body);
        return { success: true, data: item, message: 'Navigation item created successfully' };
    }
    async updateNavigationItem(id, body) {
        const item = await this.navigationService.updateNavigationItem(id, body);
        return { success: true, data: item, message: 'Navigation item updated successfully' };
    }
    async patchNavigationItem(id, body) {
        const item = await this.navigationService.updateNavigationItem(id, body);
        return { success: true, data: item, message: 'Navigation item updated successfully' };
    }
    async reorderNavigationItems(body) {
        await this.navigationService.reorderNavigationItems(body.items);
        return { success: true, message: 'Navigation items reordered successfully' };
    }
    async deleteNavigationItem(id) {
        await this.navigationService.deleteNavigationItem(id);
        return { success: true, message: 'Navigation item deleted successfully' };
    }
};
exports.NavigationController = NavigationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationItems", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationTree", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "getNavigationItem", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "createNavigationItem", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "updateNavigationItem", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "patchNavigationItem", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "reorderNavigationItems", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('website.navigation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NavigationController.prototype, "deleteNavigationItem", null);
exports.NavigationController = NavigationController = __decorate([
    (0, common_1.Controller)('navigation'),
    __metadata("design:paramtypes", [navigation_service_1.NavigationService])
], NavigationController);
//# sourceMappingURL=navigation.controller.js.map