export declare class Content {
    id: string;
    section: string;
    title: string;
    subtitle?: string;
    description: string;
    content?: string;
    image?: string;
    images?: string[];
    isActive: boolean;
    order: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
