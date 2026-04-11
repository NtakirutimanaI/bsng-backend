import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    async findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const role = await this.rolesService.findOneById(id);
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} not found`);
        }
        return role;
    }

    @Post()
    async create(
        @Body()
        body: {
            name: string;
            description: string;
            level?: number;
            isSystemRole?: boolean;
        },
    ) {
        return this.rolesService.createRole(
            body.name,
            body.description,
            body.level || 0,
            body.isSystemRole || false,
        );
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() body: { name?: string; description?: string; level?: number },
    ) {
        return this.rolesService.updateRole(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.rolesService.removeRole(id);
    }
}
