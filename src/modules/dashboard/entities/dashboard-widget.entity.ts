import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dashboard } from './dashboard.entity';

@Entity('dashboard_widgets')
export class DashboardWidget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'dashboard_id' })
  dashboardId: string;

  @ManyToOne(() => Dashboard, (dashboard) => dashboard.widgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dashboard_id' })
  dashboard: Dashboard;

  @Column({ name: 'widget_type', length: 50 })
  widgetType: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'jsonb' })
  config: any;

  @Column({ name: 'position_x' })
  positionX: number;

  @Column({ name: 'position_y' })
  positionY: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
