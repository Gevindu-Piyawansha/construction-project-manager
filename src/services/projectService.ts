import { ApiService } from './apiService';
import { API_ENDPOINTS } from '../config/api';
import { Project, ProjectCreate, ProjectUpdate } from '../types/project';

// Mock data for development - Stavanger, Norway construction projects
const mockProjects: Project[] = [
    {
        id: '1',
        name: 'Stavanger Sentrum Office Complex',
        description: 'Modern 8-story sustainable office building in downtown Stavanger with green energy systems',
        startDate: '2024-03-15',
        endDate: '2025-11-30',
        status: 'in-progress',
        budget: 185000000, // NOK
        location: 'Stavanger Sentrum',
        manager: 'Lars Andersen',
        progress: 68,
    },
    {
        id: '2',
        name: 'Forus Business Park Expansion',
        description: 'Expansion of Forus industrial area with new logistics and tech facilities',
        startDate: '2024-05-01',
        endDate: '2026-08-31',
        status: 'in-progress',
        budget: 320000000, // NOK
        location: 'Forus, Sandnes',
        manager: 'Ingrid Olsen',
        progress: 42,
    },
    {
        id: '3',
        name: 'Ryfast Tunnel Maintenance',
        description: 'Major maintenance and safety upgrades to the Ryfast undersea tunnel system',
        startDate: '2024-01-10',
        endDate: '2024-12-20',
        status: 'in-progress',
        budget: 95000000, // NOK
        location: 'Ryfast Tunnel Network',
        manager: 'Bjørn Hansen',
        progress: 75,
    },
    {
        id: '4',
        name: 'Hillevåg Residential Development',
        description: 'Sustainable residential complex with 180 apartments and community facilities',
        startDate: '2023-09-01',
        endDate: '2024-10-15',
        status: 'completed',
        budget: 425000000, // NOK
        location: 'Hillevåg, Stavanger',
        manager: 'Kari Johansen',
        progress: 100,
    },
    {
        id: '5',
        name: 'Stavanger University Hospital Extension',
        description: 'New medical wing with advanced treatment facilities and research center',
        startDate: '2024-02-01',
        endDate: '2026-06-30',
        status: 'planning',
        budget: 580000000, // NOK
        location: 'Stavanger Universitetssykehus',
        manager: 'Erik Sørensen',
        progress: 18,
    },
    {
        id: '6',
        name: 'Sandnes Town Square Renovation',
        description: 'Complete renovation of historic town square with modern public spaces',
        startDate: '2024-04-01',
        endDate: '2025-05-31',
        status: 'on-hold',
        budget: 78000000, // NOK
        location: 'Sandnes Sentrum',
        manager: 'Maria Berg',
        progress: 28,
    },
    {
        id: '7',
        name: 'Offshore Wind Port Facility',
        description: 'New port infrastructure for offshore wind turbine assembly and maintenance',
        startDate: '2024-06-01',
        endDate: '2026-12-31',
        status: 'planning',
        budget: 890000000, // NOK
        location: 'Tananger Harbor',
        manager: 'Ole Kristiansen',
        progress: 12,
    },
    {
        id: '8',
        name: 'Eiganes School Modernization',
        description: 'Complete modernization of Eiganes school with sustainable design',
        startDate: '2024-01-15',
        endDate: '2025-08-20',
        status: 'in-progress',
        budget: 125000000, // NOK
        location: 'Eiganes, Stavanger',
        manager: 'Anna Pedersen',
        progress: 55,
    },
];

class ProjectService extends ApiService {
    async getProjects(): Promise<Project[]> {
        // Use mock data for demo - replace with real API call in production
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockProjects), 500);
        });
        // return this.get<Project[]>(API_ENDPOINTS.projects.list);
    }

    async getProjectById(id: string): Promise<Project> {
        // Use mock data for demo
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const project = mockProjects.find(p => p.id === id);
                if (project) {
                    resolve(project);
                } else {
                    reject(new Error('Project not found'));
                }
            }, 300);
        });
        // return this.get<Project>(API_ENDPOINTS.projects.details(id));
    }

    async createProject(project: ProjectCreate): Promise<Project> {
        // Use mock data for demo
        return new Promise((resolve) => {
            const newProject: Project = {
                id: String(mockProjects.length + 1),
                ...project,
            } as Project;
            mockProjects.push(newProject);
            setTimeout(() => resolve(newProject), 300);
        });
        // return this.post<Project>(API_ENDPOINTS.projects.create, project);
    }

    async updateProject(id: string, project: ProjectUpdate): Promise<Project> {
        // Use mock data for demo
        return new Promise((resolve, reject) => {
            const index = mockProjects.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProjects[index] = { ...mockProjects[index], ...project };
                setTimeout(() => resolve(mockProjects[index]), 300);
            } else {
                reject(new Error('Project not found'));
            }
        });
        // return this.put<Project>(API_ENDPOINTS.projects.update(id), project);
    }

    async deleteProject(id: string): Promise<void> {
        // Use mock data for demo
        return new Promise((resolve) => {
            const index = mockProjects.findIndex(p => p.id === id);
            if (index !== -1) {
                mockProjects.splice(index, 1);
            }
            setTimeout(() => resolve(), 300);
        });
        // return this.delete(API_ENDPOINTS.projects.delete(id));
    }
}

export const projectService = new ProjectService();