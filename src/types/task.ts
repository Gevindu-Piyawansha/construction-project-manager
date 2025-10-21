export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed' | 'blocked';
    priority: 'low' | 'medium' | 'high';
    assignedTo: string[];
    startDate: string;
    dueDate: string;
    completedDate?: string;
    dependencies: string[];
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskCreate extends Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedDate'> {
    completedDate?: string;
}

export interface TaskUpdate extends Partial<TaskCreate> {
    id: string;
}