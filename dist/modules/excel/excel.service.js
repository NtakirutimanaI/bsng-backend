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
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const excel_import_entity_1 = require("./entities/excel-import.entity");
let ExcelService = class ExcelService {
    excelImportRepository;
    constructor(excelImportRepository) {
        this.excelImportRepository = excelImportRepository;
    }
    async createImportRecord(data) {
        const record = this.excelImportRepository.create(data);
        return this.excelImportRepository.save(record);
    }
    async updateStatus(id, status, stats) {
        await this.excelImportRepository.update(id, { status, ...stats });
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(excel_import_entity_1.ExcelImport)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExcelService);
//# sourceMappingURL=excel.service.js.map