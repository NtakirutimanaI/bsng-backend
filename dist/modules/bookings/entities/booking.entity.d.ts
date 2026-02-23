import { Property } from '../../properties/entities/property.entity';
export declare class Booking {
    id: string;
    propertyId: string;
    property: Property;
    name: string;
    email: string;
    phone: string;
    date: string;
    message: string;
    status: string;
    createdAt: Date;
}
