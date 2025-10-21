import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectCreate, ProjectUpdate } from '../../types/project';

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    // Simulated API call
    const response = await new Promise<Project[]>((resolve) => {
      setTimeout(() => resolve([]), 1000);
    });
    return response;
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (project: ProjectCreate) => {
    // Simulated API call
    const response = await new Promise<Project>((resolve) => {
      setTimeout(() => {
        const newProject: Project = {
          ...project,
          id: Date.now().toString(),
          progress: project.progress || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        resolve(newProject);
      }, 1000);
    });
    return response;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async (project: ProjectUpdate) => {
    // Simulated API call
    const response = await new Promise<Project>((resolve) => {
      setTimeout(() => {
        const updatedProject = {
          ...(project as Project),
          updatedAt: new Date().toISOString(),
        };
        resolve(updatedProject);
      }, 1000);
    });
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId: string) => {
    // Simulated API call
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
    return projectId;
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // Create Project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      // Update Project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;