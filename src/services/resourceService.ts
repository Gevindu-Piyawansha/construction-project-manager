import { ApiService } from './apiService';
import { Resource } from '../types/resource';

class ResourceService extends ApiService {
    async getResourcesByProject(projectId: string): Promise<Resource[]> {
        // This endpoint should be implemented in your backend
        return this.get<Resource[]>(`/projects/${projectId}/resources`);
    }
    // Additional CRUD methods can be added here
}

export const resourceService = new ResourceService();
