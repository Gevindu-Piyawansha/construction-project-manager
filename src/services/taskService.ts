import { ApiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';
import { Task, TaskCreate, TaskUpdate } from '../types/task';

class TaskService extends ApiService {
    async getTasksByProject(projectId: string): Promise<Task[]> {
        return this.get<Task[]>(API_ENDPOINTS.tasks.byProject(projectId));
    }
    async createTask(task: TaskCreate): Promise<Task> {
        return this.post<Task>(API_ENDPOINTS.tasks.create, task);
    }
    async updateTask(id: string, task: TaskUpdate): Promise<Task> {
        return this.put<Task>(API_ENDPOINTS.tasks.update(id), task);
    }
    async deleteTask(id: string): Promise<void> {
        return this.delete(API_ENDPOINTS.tasks.delete(id));
    }
}

export const taskService = new TaskService();
