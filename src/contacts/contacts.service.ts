import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepo: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    const contact = this.contactsRepo.create(dto);
    const savedContact = await this.contactsRepo.save(contact);

    // Send email notification (non-blocking)
    this.mailService.sendContactNotification(
      dto.name,
      dto.email,
      dto.subject,
      dto.message,
    ).catch(err => console.error('Failed to send contact notification email', err));

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Contact | null> {
    return this.contactsRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string): Promise<Contact | null> {
    await this.contactsRepo.update(id, { status });
    return this.findOne(id);
  }
}
