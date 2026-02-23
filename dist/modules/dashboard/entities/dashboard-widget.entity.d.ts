import { Dashboard } from './dashboard.entity';
export declare class DashboardWidget {
    id: string;
    dashboardId: string;
    dashboard: Dashboard;
    widgetType: string;
    title: string;
    config: any;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    createdAt: Date;
}
