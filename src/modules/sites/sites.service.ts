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

  async findAll() {
    return await this.sitesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const site = await this.sitesRepository.findOne({ where: { id } });
    if (!site) throw new NotFoundException('Site not found');
    return site;
  }

  async update(id: string, updateSiteDto: UpdateSiteDto) {
    const site = await this.findOne(id);
    Object.assign(site, updateSiteDto);
    return await this.sitesRepository.save(site);
  }

  async remove(id: string) {
    const site = await this.findOne(id);
    return await this.sitesRepository.remove(site);
  }
}
