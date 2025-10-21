import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import { Project } from '../../types/project';

interface ProjectDetailModalProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  onEdit?: () => void;
}

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  open,
  onClose,
  project,
  onEdit,
}) => {
  if (!project) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'planning':
        return 'info';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'error';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 24,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div" fontWeight="bold">
            {project.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Badge */}
        <Box mb={3}>
          <Chip
            label={project.status.toUpperCase().replace('-', ' ')}
            color={getStatusColor(project.status) as any}
            size="medium"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* Description */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom color="primary">
            Project Description
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {project.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Progress */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <ProgressIcon color="action" />
              <Typography variant="h6" color="primary">
                Progress
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            color={getProgressColor(project.progress) as any}
            sx={{
              height: 10,
              borderRadius: 5,
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Project Details Grid */}
        <Box className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {/* Budget */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <MoneyIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Budget
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {formatBudget(project.budget)}
            </Typography>
          </Box>

          {/* Location */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LocationIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {project.location}
            </Typography>
          </Box>

          {/* Project Manager */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Project Manager
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {project.manager}
            </Typography>
          </Box>

          {/* Start Date */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                Start Date
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(project.startDate)}
            </Typography>
          </Box>

          {/* End Date */}
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CalendarIcon color="action" fontSize="small" />
              <Typography variant="subtitle2" color="text.secondary">
                End Date
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(project.endDate)}
            </Typography>
          </Box>

          {/* Project ID */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Project ID
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              {project.id}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {onEdit && (
          <Button onClick={onEdit} variant="contained" color="primary">
            Edit Project
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDetailModal;
