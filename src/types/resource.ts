export interface Resource {
    id: string;
    name: string;
    type: 'labor' | 'equipment' | 'material';
    category: string;
    availability: 'available' | 'in-use' | 'maintenance' | 'unavailable';
    cost: number;
    unit: string;
    quantity: number;
    location: string;
    assignedProjects: string[];
    specifications: Record<string, string>;
    createdAt: string;
    updatedAt: string;
}

export interface ResourceCreate extends Omit<Resource, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ResourceUpdate extends Partial<ResourceCreate> {
    id: string;
}