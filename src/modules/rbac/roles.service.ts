import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../users/entities/user.entity';
import { Permission, PermissionAction } from './entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) { }

  async createRole(
    name: string,
    description: string,
    level: number = 0,
    isSystemRole: boolean = false,
  ): Promise<Role> {
    const role = this.rolesRepository.create({
      name,
      description,
      level,
      isSystemRole,
    });
    return this.rolesRepository.save(role);
  }

  async createPermission(
    module: string,
    action: PermissionAction,
    resource: string,
    description: string,
  ): Promise<Permission> {
    const permission = this.permissionsRepository.create({
      module,
      action,
      resource,
      description,
    });
    return this.permissionsRepository.save(permission);
  }

  async addPermissionToRole(
    roleName: string,
    permission: Permission,
  ): Promise<void> {
    const role = await this.rolesRepository.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });
    if (role) {
      role.permissions = [...role.permissions, permission];
      await this.rolesRepository.save(role);
    }
  }

  async checkPermission(
    userId: string,
    module: string,
    action: string,
    resource: string,
  ): Promise<boolean> {
    const role = await this.rolesRepository.findOne({
      where: { users: { id: userId } },
      relations: ['permissions'],
    });

    if (!role) return false;

    // SuperAdmin bypass (optional normally, but good for "Enhanced" systems)
    if (role.name === 'super_admin') return true;

    return role.permissions.some(
      (p) =>
        p.module === module && p.action === action && p.resource === resource,
    );
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      order: { level: 'DESC', name: 'ASC' },
    });
  }

  async findOneById(id: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async updateRole(id: string, data: Partial<Role>): Promise<Role | null> {
    await this.rolesRepository.update(id, data);
    return this.rolesRepository.findOne({ where: { id } });
  }

  async removeRole(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
