import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) { }

  create(data: Partial<Property>) {
    const property = this.propertiesRepository.create(data);
    return this.propertiesRepository.save(property);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    type: string = 'all',
    status: string = 'all',
    isForSale?: string,
    isForRent?: string,
  ) {
    const queryBuilder =
      this.propertiesRepository.createQueryBuilder('property');

    if (search) {
      queryBuilder.andWhere(
        '(property.title ILIKE :search OR property.code ILIKE :search OR property.location ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type && type !== 'all') {
      queryBuilder.andWhere('property.type = :type', { type });
    }

    if (status && status !== 'all') {
      queryBuilder.andWhere('property.status = :status', { status });
    }

    if (isForSale === 'true') {
      queryBuilder.andWhere('property.isForSale = :isForSale', {
        isForSale: true,
      });
    }

    if (isForRent === 'true') {
      queryBuilder.andWhere('property.isForRent = :isForRent', {
        isForRent: true,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('property.createdAt', 'DESC')
      .getManyAndCount();
    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: string) {
    return this.propertiesRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Property>) {
    await this.propertiesRepository.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.propertiesRepository.delete(id);
  }

  async seed() {
    const properties = [
      {
        code: 'PROP-BSNG-001',
        title: JSON.stringify({
          en: 'Luxury Villa in Nyarutarama',
          rw: 'Inzu y\'inyamibwa i Nyarutarama',
          fr: 'Villa de Luxe à Nyarutarama',
          sw: 'Villa ya Kifahari Nyarutarama'
        }),
        type: 'house',
        status: 'available',
        location: JSON.stringify({
          en: 'Nyarutarama, Kigali',
          rw: 'Nyarutarama, Kigali',
          fr: 'Nyarutarama, Kigali',
          sw: 'Nyarutarama, Kigali'
        }),
        size: 450,
        price: 350000000,
        monthlyRent: 2500000,
        isForSale: true,
        isForRent: true,
        bedrooms: 5,
        bathrooms: 4,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'A stunning 5-bedroom luxury villa located in the prestigious Nyarutarama neighborhood. Features a swimming pool, large garden, and modern amenities.',
          rw: 'Inzu y\'ibyumba 5 y\'akataraboneka iherereye i Nyarutarama. Ifite kidendezi, ubusitani bugari, n\'ibikoresho bigezweho.',
          fr: 'Une superbe villa de luxe de 5 chambres située dans le quartier prestigieux de Nyarutarama.',
          sw: 'Villa ya kifahari yenye vyumba 5 vya kulala iliyoko katika kitongoji mashuhuri cha Nyarutarama.'
        }),
        upi: '1/03/04/05/2026',
      },
      {
        code: 'PROP-BSNG-002',
        title: JSON.stringify({
          en: 'Modern Apartment in City Center',
          rw: 'Isakoshi igezweho hagati mu mugi',
          fr: 'Appartement Moderne au Centre-Ville',
          sw: 'Apartment ya Kisasa Katikati ya Jiji'
        }),
        type: 'apartment',
        status: 'available',
        location: JSON.stringify({
          en: 'Downtown Kigali',
          rw: 'Kigali rwagati',
          fr: 'Centre-ville de Kigali',
          sw: 'Katikati ya Jiji la Kigali'
        }),
        size: 150,
        price: 120000000,
        monthlyRent: 1200000,
        isForSale: true,
        isForRent: true,
        bedrooms: 3,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1545324418-f1d3ac157355?q=80&w=1935&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'Contemporary 3-bedroom apartment in the heart of Kigali. Walking distance to major business centers and shopping malls.',
          rw: 'Inzu y\'ibyumba 3 igezweho hagati mu mugi wa Kigali. Uri hafi y\'ibigo by\'ubucuruzi n\'amasoko.',
          fr: 'Appartement contemporain de 3 chambres au cœur de Kigali.',
          sw: 'Apartment ya kisasa yenye vyumba 3 vya kulala katikati ya Kigali.'
        }),
        upi: '2/01/02/03/2026',
      },
      {
        code: 'PROP-BSNG-003',
        title: JSON.stringify({
          en: 'Prime Industrial Plot in Bugesera',
          rw: 'Ikibanza mu gace k\'inganda i Bugesera',
          fr: 'Terrain Industriel à Bugesera',
          sw: 'Kiwanja cha Viwanda Bugesera'
        }),
        type: 'plot',
        status: 'available',
        location: JSON.stringify({
          en: 'Bugesera SEZ, Eastern Province',
          rw: 'Bugesera, Intara y\'Iburasirazuba',
          fr: 'Bugesera, Province de l\'Est',
          sw: 'Bugesera, Mkoa wa Mashariki'
        }),
        size: 2500,
        price: 75000000,
        isForSale: true,
        isForRent: false,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'Large industrial plot located in the Bugesera Special Economic Zone. Perfect for manufacturing or large-scale warehousing.',
          rw: 'Ikibanza kinini mu gace k\'inganda i Bugesera. Kibereye inganda cyangwa ububiko bunini.',
          fr: 'Grand terrain industriel situé dans la zone économique spéciale de Bugesera.',
          sw: 'Kiwanja kikubwa cha viwanda kilichoko katika Eneo Maalum la Kiuchumi la Bugesera.'
        }),
        upi: '3/05/06/07/2026',
      },
      {
        code: 'PROP-BSNG-004',
        title: JSON.stringify({
          en: 'Cozy Family Home in Kicukiro',
          rw: 'Inzu y\'umuryango i Kicukiro',
          fr: 'Maison Familiale à Kicukiro',
          sw: 'Nyumba ya Familia Kicukiro'
        }),
        type: 'house',
        status: 'available',
        location: JSON.stringify({
          en: 'Kicukiro, Niboye',
          rw: 'Kicukiro, Niboye',
          fr: 'Kicukiro, Niboye',
          sw: 'Kicukiro, Niboye'
        }),
        size: 320,
        price: 150000000,
        monthlyRent: 1500000,
        isForSale: true,
        isForRent: true,
        bedrooms: 4,
        bathrooms: 3,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'Beautiful family home with a spacious garden and annex. Located in a quiet and secure neighborhood in Niboye.',
          rw: 'Inzu nziza y\'umuryango ifite ubusitani bugari. Iherereye mu gace gatuje kandi katekanye i Niboye.',
          fr: 'Belle maison familiale avec un jardin spacieux et une annexe.',
          sw: 'Nyumba nzuri ya familia yenye bustani wasaa na nyongeza.'
        }),
        upi: '4/08/09/10/2026',
      },
      {
        code: 'PROP-BSNG-005',
        title: JSON.stringify({
          en: 'Executive Penthouse with View',
          rw: 'Isakoshi yo hejuru ifite irembo ryiza',
          fr: 'Penthouse de Luxe avec Vue',
          sw: 'Penthouse ya Kifahari yenye Mtazamo'
        }),
        type: 'apartment',
        status: 'available',
        location: JSON.stringify({
          en: 'Kiyovu, Kigali',
          rw: 'Kiyovu, Kigali',
          fr: 'Kiyovu, Kigali',
          sw: 'Kiyovu, Kigali'
        }),
        size: 280,
        price: 450000000,
        monthlyRent: 4000000,
        isForSale: true,
        isForRent: true,
        bedrooms: 4,
        bathrooms: 4,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'Exclusive penthouse in Kiyovu with 360-degree views of the city. High-end finishes and private elevator access.',
          rw: 'Isakoshi idasanzwe i Kiyovu ifite irembo rishobora kureba umugi wose. Ifite ibikoresho byo mu rwego rwo hejuru.',
          fr: 'Penthouse exclusif à Kiyovu avec une vue à 360 degrés sur la ville.',
          sw: 'Penthouse ya kipekee huko Kiyovu yenye maoni ya digrii 360 ya jiji.'
        }),
        upi: '5/11/12/13/2026',
      },
      {
        code: 'PROP-BSNG-006',
        title: JSON.stringify({
          en: 'Commercial Office Space',
          rw: 'Ibiro by\'ubucuruzi',
          fr: 'Espace de Bureaux Commerciaux',
          sw: 'Nafasi ya Ofisi ya Biashara'
        }),
        type: 'commercial',
        status: 'available',
        location: JSON.stringify({
          en: 'Kigali Heights, Kimihurura',
          rw: 'Kimihurura, Kigali Heights',
          fr: 'Kigali Heights, Kimihurura',
          sw: 'Kigali Heights, Kimihurura'
        }),
        size: 200,
        price: 500000000,
        monthlyRent: 5000000,
        isForSale: false,
        isForRent: true,
        bedrooms: 0,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=cover',
        description: JSON.stringify({
          en: 'Premium office space in a landmark building. Central air conditioning, high-speed internet, and ample parking.',
          rw: 'Ibiro byo mu rwego rwo hejuru. Bifite icyuma gikonjesha, murandasi yihuta, n\'aho guhagarika imodoka hagari.',
          fr: 'Espace de bureaux haut de gamme dans un bâtiment emblématique.',
          sw: 'Nafasi ya ofisi ya malipo katika jengo la kihistoria.'
        }),
        upi: '6/14/15/16/2026',
      },
    ];

    for (const data of properties) {
      const existing = await this.propertiesRepository.findOne({
        where: { code: data.code },
      });
      if (!existing) {
        await this.propertiesRepository.save(
          this.propertiesRepository.create(data),
        );
      }
    }

    return { message: 'Seeding completed', count: properties.length };
  }
}
