import React, { useEffect, useState, useMemo } from 'react';
import {
  Typography,
  Button,
  Box,
  Alert,
  Skeleton,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material';
// Using Tailwind grid instead of MUI Grid to avoid MUI Grid TypeScript overload errors
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4">
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

      {/* Search and Filter */}
      <Box className="mb-6 flex flex-col sm:flex-row gap-4">
        <TextField
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
          className="flex-1"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="planning">Planning</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="on-hold">On Hold</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="rectangular" width="30%" height={24} className="mb-2" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="rectangular" width="100%" height={8} className="my-3" />
                <Skeleton variant="text" width="50%" />
                <Skeleton variant="text" width="70%" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first project to get started'}
          </Typography>
        </Box>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => (
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
