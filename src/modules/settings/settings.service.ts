import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto } from './dtos/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) { }

  async findAllPublic() {
    return this.settingsRepository.find({ where: { isPublic: true } });
  }

  async findAll() {
    return this.settingsRepository.find();
  }

  async findOne(key: string) {
    const setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException(`Setting with key ${key} not found`);
    }
    return setting;
  }

  async createOrUpdate(
    key: string,
    value: string,
    group: string = 'general',
    description?: string,
    isPublic: boolean = true,
  ) {
    const existing = await this.settingsRepository.findOne({ where: { key } });
    if (existing) {
      existing.value = value;
      if (description) existing.description = description;
      existing.group = group;
      existing.isPublic = isPublic;
      return this.settingsRepository.save(existing);
    } else {
      const setting = this.settingsRepository.create({
        key,
        value,
        group,
        description,
        isPublic,
      });
      return this.settingsRepository.save(setting);
    }
  }

  async update(key: string, updateSettingDto: UpdateSettingDto) {
    const setting = await this.findOne(key);
    Object.assign(setting, updateSettingDto);
    return this.settingsRepository.save(setting);
  }

  async seed() {
    const settings = [
      // Home Page
      {
        key: 'home_hero_title',
        value: JSON.stringify({
          en: 'WE DESIGN YOUR FUTURE',
          rw: 'TUREMA EJO HAZAZA HANYU',
          fr: 'NOUS CONCEVONS VOTRE AVENIR',
          sw: 'TUNATENGENEZA BAADAYE YAKO',
        }),
        group: 'home',
        description: 'Hero section main title',
        isPublic: true,
      },
      {
        key: 'home_hero_subtitle',
        value: JSON.stringify({
          en: 'Quality Construction & Real Estate Solutions',
          rw: "Ubwubatsi n'Imitungo ku rwego rwo hejuru",
          fr: "Solutions de construction et d'immobilier de qualité",
          sw: 'Ujenzi wa Ubora na Suluhu za Mali Isiyohamishika',
        }),
        group: 'home',
        description: 'Hero section subtitle',
        isPublic: true,
      },
      {
        key: 'home_about_title',
        value: JSON.stringify({
          en: 'Building Strong Generations',
          rw: 'Kubaka Ibisubizo Birambye',
          fr: 'Bâtir des Générations Fortes',
          sw: 'Kujenga Kizazi Imara',
        }),
        group: 'home',
        description: 'About section title on home',
        isPublic: true,
      },
      {
        key: 'home_services_visible',
        value: 'true',
        group: 'home',
        description: 'Show/Hide services section',
        isPublic: true,
      },

      // About Page
      {
        key: 'about_title',
        value: JSON.stringify({
          en: 'About Us',
          rw: 'Abo Turi Bo',
          fr: 'À Propos de Nous',
          sw: 'Kuhusu Sisi',
        }),
        group: 'about',
        description: 'About page main title',
        isPublic: true,
      },
      {
        key: 'about_company_history',
        value: JSON.stringify({
          en: 'Build Strong Generations (BSNG) Ltd is a registered company in Rwanda. We specialize in providing high-quality construction services and property development solutions.',
          rw: "Build Strong Generations (BSNG) Ltd ni ikigo cyanditswe mu Rwanda. Twibanda ku gutanga serivisi z'ubwubatsi n'imitungo zo ku rwego rwo hejuru.",
          fr: 'Build Strong Generations (BSNG) Ltd est une société enregistrée au Rwanda. Nous nous spécialisons dans la fourniture de services de construction de haute qualité et de solutions de développement immobilier.',
          sw: 'Build Strong Generations (BSNG) Ltd ni kampuni iliyosajiliwa nchini Rwanda. Tunajishughulisha na kutoa huduma za ujenzi wa hali ya juu na suluhisho za maendeleo ya mali.',
        }),
        group: 'about',
        description: 'Company history text',
        isPublic: true,
      },
      {
        key: 'about_vision',
        value: JSON.stringify({
          en: 'To be the leading construction and real estate firm in the region.',
          rw: "Kuba ikigo cy'ubwubatsi n'imitungo kiyoboye mu karere.",
          fr: "Être la principale entreprise de construction et d'immobilier de la région.",
          sw: 'Kuwa kampuni inayoongoza ya ujenzi na mali isiyohamishika katika mkoa.',
        }),
        group: 'about',
        description: 'Company vision',
        isPublic: true,
      },
      {
        key: 'about_team_visible',
        value: 'true',
        group: 'about',
        description: 'Show/Hide team section',
        isPublic: true,
      },

      // Service Page
      {
        key: 'services_title',
        value: JSON.stringify({
          en: 'Our Creative Services',
          rw: 'Serivisi Zacu Zo Guhanga Udushya',
          fr: 'Nos Services Créatifs',
          sw: 'Huduma Zetu za Ubunifu',
        }),
        group: 'services',
        description: 'Services page title',
        isPublic: true,
      },
      {
        key: 'services_contact_phone',
        value: '+250 737 213 060',
        group: 'services',
        description: 'Phone number shown on services page',
        isPublic: true,
      },

      // Contact Page
      {
        key: 'contact_address',
        value: JSON.stringify({
          en: 'KG 15 Ave, Kigali, Rwanda',
          rw: 'KG 15 Ave, Kigali, Rwanda',
          fr: 'KG 15 Ave, Kigali, Rwanda',
          sw: 'KG 15 Ave, Kigali, Rwanda',
        }),
        group: 'contact',
        description: 'Company physical address',
        isPublic: true,
      },
      {
        key: 'contact_email',
        value: 'info@bsng.rw',
        group: 'contact',
        description: 'Company contact email',
        isPublic: true,
      },
      {
        key: 'contact_phone',
        value: '+250 737 213 060',
        group: 'contact',
        description: 'Company contact phone',
        isPublic: true,
      },

      // Global / Footer Settings
      {
        key: 'footer_company_name',
        value: 'BSNG CONSTRUCTION COMPANY',
        group: 'global',
        description: 'Company name shown in footer',
        isPublic: true,
      },
      {
        key: 'footer_company_description',
        value: JSON.stringify({
          en: 'Building Strong For The Next Generations. Your trusted partner in construction and property development.',
          rw: "Kubakira Ibihe Bizaza Bikomeye. Umufatanyabikorwa wizewe mu bwubatsi n'iterambere ry'imitungo.",
          fr: 'Bâtir des générations fortes pour les générations futures. Votre partenaire de confiance dans la construction et le développement immobilier.',
          sw: 'Kujenga Kizazi Imara kwa Ajili ya Kizazi Kijacho. Washirika wako wa kuaminika katika ujenzi na maendeleo ya mali.',
        }),
        group: 'global',
        description: 'Brief company bio in footer',
        isPublic: true,
      },
      {
        key: 'social_facebook',
        value: '#',
        group: 'global',
        description: 'Facebook page URL',
        isPublic: true,
      },
      {
        key: 'social_twitter',
        value: '#',
        group: 'global',
        description: 'Twitter profile URL',
        isPublic: true,
      },
      {
        key: 'social_instagram',
        value: '#',
        group: 'global',
        description: 'Instagram profile URL',
        isPublic: true,
      },
      {
        key: 'social_linkedin',
        value: '#',
        group: 'global',
        description: 'LinkedIn company page URL',
        isPublic: true,
      },
      {
        key: 'social_youtube',
        value: '#',
        group: 'global',
        description: 'YouTube channel URL',
        isPublic: true,
      },
      {
        key: 'contact_phone_1',
        value: '+250 737 213 060',
        group: 'global',
        description: 'Top bar/Footer primary phone',
        isPublic: true,
      },
      {
        key: 'contact_email_1',
        value: 'info@bsng.rw',
        group: 'global',
        description: 'Top bar/Footer primary email',
        isPublic: true,
      },
      {
        key: 'contact_address_1',
        value: JSON.stringify({
          en: 'KG 15 Ave, Kigali, Rwanda',
          rw: 'KG 15 Ave, Kigali, Rwanda',
          fr: 'KG 15 Ave, Kigali, Rwanda',
          sw: 'KG 15 Ave, Kigali, Rwanda',
        }),
        group: 'global',
        description: 'Top bar/Footer physical address',
        isPublic: true,
      },

      // Properties Page
      {
        key: 'properties_title',
        value: JSON.stringify({
          en: 'Find Your Dream Property',
          rw: 'Shakisha Inzu Wabishaka',
          fr: 'Trouvez Votre Propriété',
          sw: 'Tafuta Mali Yako',
        }),
        group: 'properties',
        description: 'Properties page main title',
        isPublic: true,
      },
      {
        key: 'properties_subtitle',
        value: JSON.stringify({
          en: 'Browse our exclusive collection of properties for sale and rent',
          rw: 'Reba imitungo yacu yo kugurisha no gukodesha',
          fr: 'Parcourez notre collection de propriétés à vendre et à louer',
          sw: 'Angalia mkusanyiko wetu wa mali za kuuza na kupanga',
        }),
        group: 'properties',
        description: 'Properties page subtitle',
        isPublic: true,
      },

      // Updates Page
      {
        key: 'updates_title',
        value: JSON.stringify({
          en: 'Latest Updates & News',
          rw: 'Amakuru Agezweho',
          fr: 'Dernières Mises à Jour',
          sw: 'Habari na Taarifa',
        }),
        group: 'updates',
        description: 'Updates page main title',
        isPublic: true,
      },
      {
        key: 'updates_subtitle',
        value: JSON.stringify({
          en: 'Stay informed with the latest news, projects, and announcements from BSNG Ltd',
          rw: "Guma uzi amakuru agezweho, imishinga, n'itangazo bya BSNG Ltd",
          fr: 'Restez informé des dernières nouvelles de BSNG Ltd',
          sw: 'Pata habari mpya na matangazo kutoka BSNG Ltd',
        }),
        group: 'updates',
        description: 'Updates page subtitle',
        isPublic: true,
      },

      // Developer / System Controls
      {
        key: 'repair_mode',
        value: 'false',
        group: 'system',
        description: 'Toggle maintenance/repair mode. If true, site shows maintenance page.',
        isPublic: true,
      },
      {
        key: 'site_public_visibility',
        value: 'true',
        group: 'system',
        description: 'Control if the site is visible on the public internet.',
        isPublic: true,
      },
    ];

    for (const s of settings) {
      await this.createOrUpdate(
        s.key,
        s.value,
        s.group,
        s.description,
        s.isPublic,
      );
    }
    return { message: 'Settings seeded successfully', count: settings.length };
  }
}
