import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_content')
export class CmsContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  page: string; // e.g., 'home', 'about', 'contact'

  @Column()
  section: string; // e.g., 'hero', 'about_section', 'newsletter'

  @Column()
  key: string; // e.g., 'title', 'subtitle', 'image_url'

  @Column({ type: 'text' })
  value: string;

  @Column({ default: false })
  isImage: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
