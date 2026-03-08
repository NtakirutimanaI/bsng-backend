import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateEntity } from './entities/update.entity';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectRepository(UpdateEntity)
    private updatesRepository: Repository<UpdateEntity>,
  ) { }

  create(data: Partial<UpdateEntity>) {
    const update = this.updatesRepository.create(data);
    return this.updatesRepository.save(update);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    category: string = '',
  ) {
    const queryBuilder = this.updatesRepository.createQueryBuilder('update');

    if (search) {
      queryBuilder.andWhere(
        '(update.title ILIKE :search OR update.excerpt ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('update.category = :category', { category });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('update.createdAt', 'DESC')
      .getManyAndCount();
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.updatesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<UpdateEntity>) {
    await this.updatesRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.updatesRepository.delete(id);
  }

  async seed() {
    const updates = [
      {
        title: JSON.stringify({
          en: 'Modern Residential Complex Project Started',
          rw: 'Umushinga w\'Inzu zo Guturamo ugezweho watangiye',
          fr: 'Projet de complexe résidentiel moderne démarré',
          sw: 'Mradi wa kisasa wa makazi umeanza'
        }),
        excerpt: JSON.stringify({
          en: 'We have broken ground on our latest 50-unit residential complex in Kibagabaga.',
          rw: 'Twatangiye kubaka umushinga w\'inzu 50 zo guturamo i Kibagabaga.',
          fr: 'Nous avons commencé les travaux sur notre dernier complexe résidentiel de 50 unités à Kibagabaga.',
          sw: 'Tumeanza ujenzi kwenye mradi wetu mpya wa makazi wa vitengo 50 kule Kibagabaga.'
        }),
        content: JSON.stringify({
          en: 'Full content about the construction progress...',
          rw: 'Ubusobanuro bwose ku iterambere ry\'ubwubatsi...',
          fr: 'Contenu complet sur l\'avancement des travaux...',
          sw: 'Maelezo kamili kuhusu maendeleo ya ujenzi...'
        }),
        category: 'Projects',
        author: 'Admin',
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=cover',
        tags: ['Construction', 'Real Estate'],
      },
      {
        title: JSON.stringify({
          en: 'BSNG Wins Regional Construction Excellence Award',
          rw: 'BSNG yatsindiye igihembo cy\'indashyikirwa mu bwubatsi mu karere',
          fr: 'BSNG remporte le prix régional d\'excellence en construction',
          sw: 'BSNG yashinda tuzo ya ubora wa ujenzi kikanda'
        }),
        excerpt: JSON.stringify({
          en: 'Our commitment to quality has been recognized by the Construction Excellence Board.',
          rw: 'Ubuhanga bwacu mu bwubatsi bwishimiwe n\'akanama gashinzwe ubuziranenge.',
          fr: 'Notre engagement envers la qualité a été reconnu par le Conseil d\'excellence en construction.',
          sw: 'Kujitolea kwetu kwa ubora kumetambuliwa na Bodi ya Ubora wa Ujenzi.'
        }),
        content: JSON.stringify({
          en: 'We are honored to receive this prestigious award. It reflects the hard work and dedication of our entire team in delivering top-tier construction projects.',
          rw: 'Tunejejwe no guhabwa iki gihembo. Biragaragaza imbaraga n\'ubwitange bw\'ikipe yacu yose mu gutanga imishinga y\'ubwubatsi yo ku rwego rwo hejuru.',
          fr: 'Nous sommes honorés de recevoir ce prix prestigieux. Il reflète le travail acharné et le dévouement de toute notre équipe.',
          sw: 'Tunaheshimika kupokea tuzo hii adhimu. Inaonyesha kazi ngumu na kujitolea kwa timu yetu yote.'
        }),
        category: 'Awards',
        author: 'Management',
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1578912853046-01a7690d857a?q=80&w=2148&auto=format&fit=cover',
        tags: ['Award', 'Excellence'],
      },
      {
        title: JSON.stringify({
          en: 'Annual Real Estate Investment Summit 2026',
          rw: 'Inama Nganduraruganda ku Ishoramari ry\'Imitungo ya 2026',
          fr: 'Sommet annuel de l\'investissement immobilier 2026',
          sw: 'Mkutano wa kila mwaka wa uwekezaji wa mali 2026'
        }),
        excerpt: JSON.stringify({
          en: 'Join us next month as we discuss the future of property development in East Africa.',
          rw: 'Mubatumirwa mu kwezi gutaha mu kiganiro ku hazaza h\'iterambere ry\'imitungo.',
          fr: 'Rejoignez-nous le mois prochain pour discuter de l\'avenir du développement immobilier en Afrique de l\'Est.',
          sw: 'Jiunge nasi mwezi ujao tukijadili mustakabali wa maendeleo ya mali Afrika Mashariki.'
        }),
        content: JSON.stringify({
          en: 'The summit will bring together industry leaders, investors, and policymakers to explore opportunities and challenges in the growing East African real estate market.',
          rw: 'Iyi nama izahuza abayobozi mu nganda, abashoramari, n\'abashyiraho amategeko kugira ngo barebe amahirwe n\'imbogamizi mu isoko ry\'iterambere ry\'imitungo muri Afurika y\'Uburasirazuba.',
          fr: 'Le sommet réunira des chefs d\'entreprise, des investisseurs et des décideurs politiques pour explorer les opportunités du marché immobilier.',
          sw: 'Mkutano huo utawaleta pamoja viongozi wa sekta, wawekezaji, na watunga sera ili kuchunguza fursa na changamoto.'
        }),
        category: 'Events',
        author: 'PR Team',
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=2070&auto=format&fit=cover',
        tags: ['Event', 'Summit'],
      },
      {
        title: JSON.stringify({
          en: 'BSNG Expands Headquarters to New Modern Facility',
          rw: 'BSNG yimuriye icyicaro cyayo mu nyubako nshya igezweho',
          fr: 'BSNG étend son siège social vers une nouvelle installation moderne',
          sw: 'BSNG yapanua makao makuu yake hadi kituo kipya cha kisasa'
        }),
        excerpt: JSON.stringify({
          en: 'To better serve our clients, we have moved to a purpose-built facility in Kigali.',
          rw: 'Kugira ngo turusheho gufasha abakiriya bacu, twimukiye mu nyubako nshya i Kigali.',
          fr: 'Pour mieux servir nos clients, nous avons emménagé dans une installation sur mesure à Kigali.',
          sw: 'Ili kuwahudumia wateja wetu vyema zaidi, tumehamia kituo kilichojengwa maalum mjini Kigali.'
        }),
        content: JSON.stringify({
          en: 'The new headquarters features expanded office space, state-of-the-art design studios, and enhanced client meeting areas to support our growing operations.',
          rw: 'Icyicaro gishya gifite ibiro bigari, sitidiyo zigezweho zo gushushanya, n\'ahantu heza ho guhurira n\'abakiriya.',
          fr: 'Le nouveau siège social comprend des bureaux agrandis, des studios de conception de pointe et des zones de réunion améliorées.',
          sw: 'Makao makuu mapya yana nafasi ya ofisi iliyopanuliwa, studio za kisasa za usanifu, na maeneo yaliyoboreshwa ya mikutano.'
        }),
        category: 'Company',
        author: 'CEO',
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=cover',
        tags: ['HQ', 'Expansion'],
      },
      {
        title: JSON.stringify({
          en: 'The Future of Green Building in Rwanda',
          rw: 'Ahazaza h\'Ubwubatsi budangiza ibidukikije mu Rwanda',
          fr: 'L\'avenir du bâtiment durable au Rwanda',
          sw: 'Mustakabali wa ujenzi wa kijani nchini Rwanda'
        }),
        excerpt: JSON.stringify({
          en: 'Discover how we are integrating sustainable practices into all our new projects.',
          rw: 'Menya uko turimo gukoresha uburyo budangiza ibidukikije mu mishinga yacu mishya.',
          fr: 'Découvrez comment nous intégrons des pratiques durables dans tous nos nouveaux projets.',
          sw: 'Gundua jinsi tunavyojumuisha mazoea endelevu katika miradi yetu yote mipya.'
        }),
        content: JSON.stringify({
          en: 'We are committed to reducing our environmental footprint by using sustainable materials, solar energy integration, and smart water management systems in our construction.',
          rw: 'Twiyemeje kugabanya ingaruka ku bidukikije dukoresha ibikoresho birambye, ingufu z\'izuba, n\'uburyo bwo gucunga amazi neza mu bwubatsi bwacu.',
          fr: 'Nous nous engageons à réduire notre empreinte environnementale en utilisant des matériaux durables et l\'énergie solaire.',
          sw: 'Tumejitolea kupunguza athari zetu kwa mazingira kwa kutumia nyenzo endelevu na nishati ya jua.'
        }),
        category: 'News',
        author: 'Engineering',
        date: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1518005020455-2cc02ae9289d?q=80&w=2070&auto=format&fit=cover',
        tags: ['Green Building', 'Sustainability'],
      },
    ];

    for (const u of updates) {
      const existing = await this.updatesRepository.findOne({
        where: { title: u.title },
      });
      if (!existing) {
        await this.updatesRepository.save(this.updatesRepository.create(u));
      }
    }
    return { message: 'Updates seeded successfully', count: updates.length };
  }
}
