export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
    budget: number;
    location: string;
    manager: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectCreate extends Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'> {
    progress?: number;
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
    id: string;
}