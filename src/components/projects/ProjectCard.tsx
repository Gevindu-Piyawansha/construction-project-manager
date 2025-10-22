import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  LinearProgress,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

type StatusColor = 'info' | 'primary' | 'success' | 'warning' | 'default';

const getStatusColor = (status: Project['status']): StatusColor => {
  switch (status) {
    case 'planning':
      return 'info';
    case 'in-progress':
      return 'primary';
    case 'completed':
      return 'success';
    case 'on-hold':
      return 'warning';
    default:
      return 'default';
  }
};

const getProgressColor = (progress: number): string => {
  if (progress >= 75) return '#4caf50';
  if (progress >= 50) return '#ff9800';
  if (progress >= 25) return '#2196f3';
  return '#f44336';
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -6 }}
    >
      <Card 
        className="h-full flex flex-col"
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: 3,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 12,
            borderColor: 'primary.main',
          },
        }}
        onClick={() => onView(project)}
      >
      <CardContent className="flex-grow">
        <Box className="flex justify-between items-start mb-3">
          <Typography 
            variant="h6" 
            component="div" 
            className="font-bold"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </Typography>
          <Chip
            label={project.status.replace('-', ' ').toUpperCase()}
            color={getStatusColor(project.status)}
            size="small"
            sx={{ 
              fontWeight: 600,
              ml: 1,
              flexShrink: 0,
            }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          className="mb-3"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}
        >
          {project.description || 'No description provided'}
        </Typography>

        <Box className="mb-3">
          <Box className="flex justify-between items-center mb-1">
            <Typography variant="caption" color="text.secondary" className="font-semibold">
              Progress
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                color: getProgressColor(project.progress || 0)
              }}
            >
              {project.progress || 0}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress || 0}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
                backgroundColor: getProgressColor(project.progress || 0),
              },
            }}
          />
        </Box>

        <Box className="space-y-2">
          <Box className="flex items-center gap-2">
            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box className="flex items-center gap-2">
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {project.manager}
            </Typography>
          </Box>

          <Box className="flex justify-between items-center pt-2 border-t border-gray-200">
            <Typography variant="body2" className="font-semibold" color="primary">
              {new Intl.NumberFormat('no-NO', {
                style: 'currency',
                currency: 'NOK',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(project.budget)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              📍 {project.location}
            </Typography>
          </Box>
        </Box>

        {/* Click indicator */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            mt: 2,
            opacity: 0.6,
            transition: 'opacity 0.3s',
            '&:hover': {
              opacity: 1,
            }
          }}
        >
          <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
            View Details
          </Typography>
          <ArrowIcon sx={{ fontSize: 16, ml: 0.5, color: 'primary.main' }} />
        </Box>
      </CardContent>
      
      <CardActions className="justify-between px-4 pb-3">
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Click card to view details
        </Typography>
        <Box className="flex gap-1">
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onView(project);
              }}
              sx={{ color: 'primary.main' }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Project">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              sx={{ color: 'info.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
    </motion.div>
  );
};

export default ProjectCard;