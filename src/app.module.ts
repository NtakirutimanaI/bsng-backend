import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { ProjectsModule } from './projects/projects.module';
import { UpdatesModule } from './updates/updates.module';
import { ServicesModule } from './services/services.module';
import { TeamsModule } from './teams/teams.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { User } from './users/user.entity';
import { Contact } from './contacts/contact.entity';
import { Project } from './projects/project.entity';
import { Update } from './updates/update.entity';
import { Service } from './services/service.entity';
import { Team } from './teams/team.entity';
import { Testimonial } from './testimonials/testimonial.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { SitesModule } from './sites/sites.module';
import { Site } from './sites/site.entity';
import { CmsModule } from './cms/cms.module';
import { CmsContent } from './cms/cms.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'bsng_db'),
        entities: [User, Contact, Project, Update, Service, Team, Testimonial, Site, CmsContent, 'dist/**/*.entity.js'],
        synchronize: true, // Auto-create tables in development
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
    
    // Feature Modules
    MailModule,
    CloudinaryModule,
    UsersModule,
    AuthModule,
    ContactsModule,
    ProjectsModule,
    UpdatesModule,
    ServicesModule,
    TeamsModule,
    TestimonialsModule,
    AttendanceModule,
    SitesModule,
    CmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
