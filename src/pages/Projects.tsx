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
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../features/projects/projectSlice';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import ProjectDetailModal from '../components/projects/ProjectDetailModal';
import Toast from '../components/common/Toast';
import { useToast } from '../hooks/useToast';
import { Project, ProjectCreate } from '../types/project';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();  
 
  const { projects, loading, error } = useAppSelector((state: any) => state.projects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  
  // Toast notifications hook
  const { toastState, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (project: ProjectCreate) => {
    try {
      await dispatch(createProject(project)).unwrap();
      setIsFormOpen(false);
      showSuccess(`Project "${project.name}" created successfully!`);
    } catch (err) {
      showError('Failed to create project. Please try again.');
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleUpdateProject = async (project: ProjectCreate) => {
    if (selectedProject) {
      try {
        await dispatch(updateProject({ id: selectedProject.id, ...project })).unwrap();
        setIsFormOpen(false);
        setSelectedProject(null);
        showSuccess(`Project "${project.name}" updated successfully!`);
      } catch (err) {
        showError('Failed to update project. Please try again.');
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find((p: Project) => p.id === projectId);
    if (window.confirm(`Are you sure you want to delete "${project?.name}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        showSuccess('Project deleted successfully!');
      } catch (err) {
        showError('Failed to delete project. Please try again.');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProject(null);
  };

  const handleViewProject = (project: Project) => {
    setViewProject(project);
  };

  const handleCloseDetailModal = () => {
    setViewProject(null);
  };

  const handleEditFromDetailModal = () => {
    if (viewProject) {
      setSelectedProject(viewProject);
      setViewProject(null);
      setIsFormOpen(true);
    }
  };

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project: Project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    result.sort((a: Project, b: Project) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'budget':
          return b.budget - a.budget; // Highest first
        case 'progress':
          return b.progress - a.progress; // Highest first
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

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

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              Total
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.length}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            bgcolor: '#2196f3', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              Planning
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.filter((p: Project) => p.status === 'planning').length}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            bgcolor: 'warning.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              In Progress
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.filter((p: Project) => p.status === 'in-progress').length}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            bgcolor: 'success.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              Completed
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.filter((p: Project) => p.status === 'completed').length}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            bgcolor: 'error.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              On Hold
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.filter((p: Project) => p.status === 'on-hold').length}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white',
            borderRadius: 2,
            boxShadow: 3,
            flex: '1 1 150px',
            minWidth: '150px',
            maxWidth: '200px',
            height: '110px',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            }
          }}
        >
          <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
              Avg Progress
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {projects.length > 0 
                ? Math.round(projects.reduce((sum: number, p: Project) => sum + p.progress, 0) / projects.length)
                : 0}%
            </Typography>
          </CardContent>
        </Card>
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
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="name">Name (A-Z)</MenuItem>
          <MenuItem value="startDate">Start Date</MenuItem>
          <MenuItem value="endDate">End Date</MenuItem>
          <MenuItem value="budget">Budget (High-Low)</MenuItem>
          <MenuItem value="progress">Progress (High-Low)</MenuItem>
          <MenuItem value="status">Status</MenuItem>
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
        <motion.div 
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredProjects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProjectCard
                project={project}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
        initialData={selectedProject || undefined}
        title={selectedProject ? 'Edit Project' : 'Create Project'}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        open={!!viewProject}
        onClose={handleCloseDetailModal}
        project={viewProject}
        onEdit={handleEditFromDetailModal}
      />

      {/* Toast Notifications */}
      <Toast
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={hideToast}
      />
    </Box>
  );
};

export default Projects;
