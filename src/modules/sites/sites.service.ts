import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './entities/site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
  ) { }

  async create(createSiteDto: CreateSiteDto) {
    const site = this.sitesRepository.create(createSiteDto);
    return await this.sitesRepository.save(site);
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const queryBuilder = this.sitesRepository.createQueryBuilder('site')
      .leftJoinAndSelect('site.employees', 'employee')
      .leftJoinAndSelect('site.expenses', 'expense');

    if (search) {
      queryBuilder.andWhere(
        '(site.name ILIKE :search OR site.code ILIKE :search OR site.location ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [sites, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('site.createdAt', 'DESC')
      .getManyAndCount();

    const data = sites.map(site => {
      const expensesTotal = (site as any).expenses?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0;
      return {
        ...site,
        employeesCount: (site as any).employees?.length || 0,
        totalExpenses: expensesTotal,
      };
    });

    return { data, total };
  }

  async findOne(id: string) {
    const site = await this.sitesRepository.findOne({ where: { id } });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    await this.sitesRepository.update(id, updateSiteDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const site = await this.findOne(id);
    return await this.sitesRepository.remove(site);
  }
}