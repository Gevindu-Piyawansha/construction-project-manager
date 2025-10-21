import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../features/projects/projectSlice';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import { Project, ProjectCreate } from '../types/project';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = (project: ProjectCreate) => {
    dispatch(createProject(project));
    setIsFormOpen(false);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = (project: ProjectCreate) => {
    if (selectedProject) {
      dispatch(updateProject({ id: selectedProject.id, ...project }));
      setIsFormOpen(false);
      setSelectedProject(null);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          New Project
        </Button>
      </Box>

      {loading ? (
        <Box className="flex justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                project={project}
                onView={() => {}} // Will implement project details view later
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        initialData={selectedProject || undefined}
        title={selectedProject ? 'Edit Project' : 'Create Project'}
      />
    </Box>
  );
};

export default Projects;