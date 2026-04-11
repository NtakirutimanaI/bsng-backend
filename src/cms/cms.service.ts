import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsContent } from './cms.entity';

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(CmsContent)
    private cmsRepo: Repository<CmsContent>,
  ) {}

  async findByPage(page: string): Promise<CmsContent[]> {
    return this.cmsRepo.find({ where: { page } });
  }

  async updateContent(page: string, section: string, key: string, value: string, isImage: boolean): Promise<CmsContent> {
    let content = await this.cmsRepo.findOne({ where: { page, section, key } });

    if (content) {
      content.value = value;
      content.isImage = isImage;
    } else {
      content = this.cmsRepo.create({ page, section, key, value, isImage });
    }

    return this.cmsRepo.save(content);
  }

  async getPageData(page: string): Promise<Record<string, any>> {
    const contents = await this.findByPage(page);
    const result: Record<string, any> = {};

    contents.forEach((item) => {
      if (!result[item.section]) {
        result[item.section] = {};
      }
      result[item.section][item.key] = item.value;
    });

    return result;
  }

  async bulkUpdate(page: string, data: Record<string, any>): Promise<void> {
    for (const section in data) {
      for (const key in data[section]) {
        const value = data[section][key];
        const isImage = value && (value.startsWith('http') || value.startsWith('data:image'));
        await this.updateContent(page, section, key, value, isImage);
      }
    }
  }
}
