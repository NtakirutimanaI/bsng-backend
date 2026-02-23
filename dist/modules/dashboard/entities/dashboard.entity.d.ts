import { Role } from '../../rbac/entities/role.entity';
import { DashboardWidget } from './dashboard-widget.entity';
export declare class Dashboard {
    id: string;
    roleId: string;
    role: Role;
    name: string;
    layout: any;
    isDefault: boolean;
    createdAt: Date;
    widgets: DashboardWidget[];
}
