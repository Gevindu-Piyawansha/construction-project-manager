import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectCreate, ProjectUpdate } from '../../types/project';
import { projectService } from '../../services/projectService';

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

export const fetchProjects = createAsyncThunk<Project[], void, { rejectValue: string }>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await projectService.getProjects();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createProject = createAsyncThunk<Project, ProjectCreate, { rejectValue: string }>(
  'projects/createProject',
  async (project: ProjectCreate, { rejectWithValue }) => {
    try {
      return await projectService.createProject(project);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProject = createAsyncThunk<Project, ProjectUpdate, { rejectValue: string }>(
  'projects/updateProject',
  async (project: ProjectUpdate, { rejectWithValue }) => {
    try {
      return await projectService.updateProject(project.id, project);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProject = createAsyncThunk<string, string, { rejectValue: string }>(
  'projects/deleteProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
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
        const index = state.projects.findIndex((p: Project) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete Project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p: Project) => p.id !== action.payload);
      });
  },
});

export const { setSelectedProject } = projectsSlice.actions;
export default projectsSlice.reducer;