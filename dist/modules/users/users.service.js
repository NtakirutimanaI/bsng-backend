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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(userData) {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }
    async findOne(id) {
        return this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    }
    async update(id, userData) {
        await this.usersRepository.update(id, userData);
        return this.usersRepository.findOne({ where: { id }, relations: ['role'] });
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({
            where: { username },
            relations: ['role'],
        });
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['role'],
        });
    }
    async findByPhone(phone) {
        return this.usersRepository.findOne({
            where: { phone },
            relations: ['role'],
        });
    }
    async findAll(page = 1, limit = 10, userRole, search) {
        const qb = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .orderBy('user.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (userRole) {
            qb.andWhere('user.userRole = :userRole', { userRole });
        }
        if (search) {
            qb.andWhere('(user.fullName ILIKE :search OR user.email ILIKE :search OR user.username ILIKE :search)', { search: `%${search}%` });
        }
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }
    async search(query) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.fullName ILIKE :query OR user.email ILIKE :query', {
            query: `%${query}%`,
        })
            .leftJoinAndSelect('user.role', 'role')
            .getMany();
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
    async findByResetToken(token) {
        return this.usersRepository.findOne({
            where: { resetToken: token },
            relations: ['role'],
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map