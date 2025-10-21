import { ApiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';
import { Project, ProjectCreate, ProjectUpdate } from '../types/project';

class ProjectService extends ApiService {
    async getProjects(): Promise<Project[]> {
        return this.get<Project[]>(API_ENDPOINTS.projects.list);
    }

    async getProjectById(id: string): Promise<Project> {
        return this.get<Project>(API_ENDPOINTS.projects.details(id));
    }

    async createProject(project: ProjectCreate): Promise<Project> {
        return this.post<Project>(API_ENDPOINTS.projects.create, project);
    }

    async updateProject(id: string, project: ProjectUpdate): Promise<Project> {
        return this.put<Project>(API_ENDPOINTS.projects.update(id), project);
    }

    async deleteProject(id: string): Promise<void> {
        return this.delete(API_ENDPOINTS.projects.delete(id));
    }
}

export const projectService = new ProjectService();