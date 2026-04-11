import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { User } from '../users/entities/user.entity';

describe('MessagesService', () => {
  let service: MessagesService;
  let messagesRepository;
  let contactMessagesRepository;
  let usersRepository;

  beforeEach(async () => {
    const mockRepo = () => ({
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest
        .fn()
        .mockImplementation((entity) =>
          Promise.resolve({ id: 'uuid', ...entity }),
        ),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useFactory: mockRepo },
        { provide: getRepositoryToken(ContactMessage), useFactory: mockRepo },
        { provide: getRepositoryToken(User), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messagesRepository = module.get(getRepositoryToken(Message));
    contactMessagesRepository = module.get(getRepositoryToken(ContactMessage));
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createContactMessage', () => {
    it('should save a contact message and create a chat message if email and name are present', async () => {
      const data = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'World',
      };

      usersRepository.findOne.mockResolvedValue(null); // User doesn't exist
      usersRepository.findOne.mockResolvedValueOnce(null); // First call for sender
      usersRepository.findOne.mockResolvedValueOnce({ id: 'admin-id' }); // Second call for admin

      const result = await service.createContactMessage(data);

      expect(contactMessagesRepository.save).toHaveBeenCalled();
      expect(usersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: data.email,
          fullName: data.name,
        }),
      );
      expect(messagesRepository.save).toHaveBeenCalled();
      expect(result.id).toBeDefined();
    });

    it('should not create a chat message if email is missing', async () => {
      const data = {
        name: 'Test User',
        subject: 'Hello',
        message: 'World',
      };

      await service.createContactMessage(data);

      expect(contactMessagesRepository.save).toHaveBeenCalled();
      expect(messagesRepository.save).not.toHaveBeenCalled();
    });
  });
});
