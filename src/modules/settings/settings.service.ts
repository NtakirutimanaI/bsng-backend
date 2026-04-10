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
      // Do NOT overwrite existing.value here! It was maliciously erasing all user edits on server start.
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
    let setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      setting = this.settingsRepository.create({ key, ...updateSettingDto, group: 'general', isPublic: true });
    } else {
      Object.assign(setting, updateSettingDto);
    }
    return this.settingsRepository.save(setting);
  }

  async updateValue(key: string, value: string) {
    let setting = await this.settingsRepository.findOne({ where: { key } });
    if (!setting) {
      setting = this.settingsRepository.create({ key, value, group: 'external', isPublic: true });
    } else {
      setting.value = value;
    }
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
      {
        key: 'home_hero_bg',
        value: '/img/new/about1.png',
        group: 'home',
        description: 'Hero background image',
        isPublic: true,
      },
      // Homepage Features
      {
        key: 'home_feature_1_title',
        value: JSON.stringify({
          en: 'Residential Construction',
          rw: 'Ubwubatsi bw\'Inzu zo Guturamo',
          fr: 'Construction Résidentielle',
          sw: 'Ujenzi wa Makazi',
        }),
        group: 'home',
        description: 'First feature title on home',
        isPublic: true,
      },
      {
        key: 'home_feature_2_title',
        value: JSON.stringify({
          en: 'Commercial Construction',
          rw: 'Ubwubatsi bw\'Inzu z\'Ubucuruzi',
          fr: 'Construction Commerciale',
          sw: 'Ujenzi wa Biashara',
        }),
        group: 'home',
        description: 'Second feature title on home',
        isPublic: true,
      },
      {
        key: 'home_feature_3_title',
        value: JSON.stringify({
          en: 'Project Management',
          rw: 'Igenamigambi ry\'Imishinga',
          fr: 'Gestion de Projet',
          sw: 'Usimamizi wa Mradi',
        }),
        group: 'home',
        description: 'Third feature title on home',
        isPublic: true,
      },
      {
        key: 'home_feature_4_title',
        value: JSON.stringify({
          en: 'Fair Prices',
          rw: 'Ibiciro Byiza',
          fr: 'Prix Équitables',
          sw: 'Bei Nzuri',
        }),
        group: 'home',
        description: 'Fourth feature title on home',
        isPublic: true,
      },
      {
        key: 'home_feature_1_icon',
        value: 'building',
        group: 'home',
        description: 'Icon for first feature (building, hardhat, wallet)',
        isPublic: true,
      },
      {
        key: 'home_feature_2_icon',
        value: 'building',
        group: 'home',
        description: 'Icon for second feature (building, hardhat, wallet)',
        isPublic: true,
      },
      {
        key: 'home_feature_3_icon',
        value: 'hardhat',
        group: 'home',
        description: 'Icon for third feature (building, hardhat, wallet)',
        isPublic: true,
      },
      {
        key: 'home_feature_4_icon',
        value: 'wallet',
        group: 'home',
        description: 'Icon for fourth feature (building, hardhat, wallet)',
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
      {
        key: 'home_about_image',
        value: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop',
        group: 'home',
        description: 'Image displayed on home about section',
        isPublic: true,
      },
      {
        key: 'home_carousel_1',
        value: '/img/new/about1.png',
        group: 'home',
        description: 'First hero carousel image',
        isPublic: true,
      },
      {
        key: 'home_carousel_2',
        value: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop',
        group: 'home',
        description: 'Second hero carousel image',
        isPublic: true,
      },
      {
        key: 'home_carousel_3',
        value: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2062&auto=format&fit=crop',
        group: 'home',
        description: 'Third hero carousel image',
        isPublic: true,
      },
      {
        key: 'home_project_card_1',
        value: '/img/project-1.jpg',
        group: 'home',
        description: 'Project category image 1',
        isPublic: true,
      },
      {
        key: 'home_project_card_2',
        value: '/img/project-2.jpg',
        group: 'home',
        description: 'Project category image 2',
        isPublic: true,
      },
      {
        key: 'home_project_card_3',
        value: '/img/project-3.jpg',
        group: 'home',
        description: 'Project category image 3',
        isPublic: true,
      },
      {
        key: 'home_project_card_4',
        value: '/img/project-4.jpg',
        group: 'home',
        description: 'Project category image 4',
        isPublic: true,
      },
      {
        key: 'home_project_card_5',
        value: '/img/project-5.jpg',
        group: 'home',
        description: 'Project category image 5',
        isPublic: true,
      },
      {
        key: 'home_project_card_6',
        value: '/img/project-6.jpg',
        group: 'home',
        description: 'Project category image 6',
        isPublic: true,
      },
      {
        key: 'about_image_1',
        value: '/img/about-1.jpg',
        group: 'about',
        description: 'First image in About section',
        isPublic: true,
      },
      {
        key: 'about_image_2',
        value: '/img/about-2.jpg',
        group: 'about',
        description: 'Secondary image on about page',
        isPublic: true,
      },
      {
        key: 'about_team_1',
        value: '/img/team-1.jpg',
        group: 'about',
        description: 'Team member 1 image',
        isPublic: true,
      },
      {
        key: 'about_team_2',
        value: '/img/team-2.jpg',
        group: 'about',
        description: 'Team member 2 image',
        isPublic: true,
      },
      {
        key: 'about_team_3',
        value: '/img/team-3.jpg',
        group: 'about',
        description: 'Team member 3 image',
        isPublic: true,
      },
      {
        key: 'about_team_4',
        value: '/img/team-4.jpg',
        group: 'about',
        description: 'Team member 4 image',
        isPublic: true,
      },
      ...[1, 2, 3, 4].flatMap(i => [
        {
          key: `about_team_${i}_name`,
          value: i === 1 ? 'N. Jean Pierre' : i === 2 ? 'M. Claudine' : i === 3 ? 'K. Eric' : 'S. Alice',
          group: 'about',
          description: `Team member ${i} name`,
          isPublic: true,
        },
        {
          key: `about_team_${i}_role`,
          value: i === 1 ? 'Managing Director' : i === 2 ? 'Senior Architect' : i === 3 ? 'Project Manager' : 'Site Engineer',
          group: 'about',
          description: `Team member ${i} role`,
          isPublic: true,
        }
      ]),
      ...[1, 2, 3, 4, 5, 6].map(i => ({
        key: `home_project_card_${i}_count`,
        value: i === 1 ? '72 Projects' : i === 2 ? '67 Projects' : i === 3 ? '45 Projects' : i === 4 ? '120 Properties' : i === 5 ? '85 Properties' : '200+ Clients',
        group: 'home',
        description: `Project category count ${i}`,
        isPublic: true,
      })),

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
      {
        key: 'service_image_1',
        value: '/img/service-1.jpg',
        group: 'services',
        description: 'First image in Services section',
        isPublic: true,
      },
      {
        key: 'service_image_2',
        value: '/img/service-2.jpg',
        group: 'services',
        description: 'Second service representative image',
        isPublic: true,
      },
      {
        key: 'service_image_3',
        value: '/img/service-3.jpg',
        group: 'services',
        description: 'Third service representative image',
        isPublic: true,
      },
      {
        key: 'service_image_4',
        value: '/img/service-4.jpg',
        group: 'services',
        description: 'Fourth service representative image',
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
        value: 'info.buildstronggenerations@gmail.com',
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
        value: 'info.buildstronggenerations@gmail.com',
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
      {
        key: 'global_newsletter_bg',
        value: '/img/newsletter.jpg',
        group: 'global',
        description: 'Newsletter background image',
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
