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
exports.ExcelImport = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let ExcelImport = class ExcelImport {
    id;
    userId;
    user;
    filename;
    filePath;
    importType;
    status;
    totalRecords;
    successRecords;
    failedRecords;
    errors;
    createdAt;
};
exports.ExcelImport = ExcelImport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExcelImport.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], ExcelImport.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ExcelImport.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ExcelImport.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_path', length: 500 }),
    __metadata("design:type", String)
], ExcelImport.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'import_type', length: 50 }),
    __metadata("design:type", String)
], ExcelImport.prototype, "importType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'pending' }),
    __metadata("design:type", String)
], ExcelImport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_records', default: 0 }),
    __metadata("design:type", Number)
], ExcelImport.prototype, "totalRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'success_records', default: 0 }),
    __metadata("design:type", Number)
], ExcelImport.prototype, "successRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failed_records', default: 0 }),
    __metadata("design:type", Number)
], ExcelImport.prototype, "failedRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ExcelImport.prototype, "errors", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExcelImport.prototype, "createdAt", void 0);
exports.ExcelImport = ExcelImport = __decorate([
    (0, typeorm_1.Entity)('excel_imports')
], ExcelImport);
//# sourceMappingURL=excel-import.entity.js.map