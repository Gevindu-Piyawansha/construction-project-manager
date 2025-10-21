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
  [key: string]: any; // Allow additional properties for flexibility
}

export type ProjectCreate = Omit<Project, 'id'>;

export type ProjectUpdate = Partial<Project> & { id: string };
