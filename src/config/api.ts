export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    projects: {
        base: '/projects',
        list: '/projects',
        create: '/projects',
        update: (id: string) => `/projects/${id}`,
        delete: (id: string) => `/projects/${id}`,
        details: (id: string) => `/projects/${id}`,
    },
    tasks: {
        base: '/tasks',
        list: '/tasks',
        create: '/tasks',
        update: (id: string) => `/tasks/${id}`,
        delete: (id: string) => `/tasks/${id}`,
        byProject: (projectId: string) => `/projects/${projectId}/tasks`,
    },
    resources: {
        base: '/resources',
        list: '/resources',
        create: '/resources',
        update: (id: string) => `/resources/${id}`,
        delete: (id: string) => `/resources/${id}`,
        available: '/resources/available',
    },
} as const;