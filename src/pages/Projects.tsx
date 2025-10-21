import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
// Using Tailwind grid instead of MUI Grid to avoid MUI Grid TypeScript overload errors
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { projects, loading, error } = useAppSelector((state: any) => state.projects);
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

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <div key={project.id}>
              <ProjectCard
                project={project}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </div>
          ))}
        </div>
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
