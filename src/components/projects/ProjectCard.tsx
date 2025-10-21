import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  LinearProgress,
  Box,
  Chip,
} from '@mui/material';
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow">
        <Typography variant="h6" gutterBottom>
          {project.name}
        </Typography>
        <Chip
          label={project.status.replace('-', ' ').toUpperCase()}
          color={getStatusColor(project.status)}
          size="small"
          className="mb-2"
        />
        <Typography variant="body2" color="text.secondary" className="mb-2">
          {project.description}
        </Typography>
        <Box className="mt-2">
          <Typography variant="body2" color="text.secondary">
            Progress
          </Typography>
          <Box className="flex items-center">
            <Box className="flex-grow mr-2">
              <LinearProgress
                variant="determinate"
                value={project.progress}
                className="h-2"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Box>
        </Box>
        <Box className="mt-2">
          <Typography variant="body2" color="text.secondary">
            Budget: ${project.budget.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {project.location}
          </Typography>
        </Box>
      </CardContent>
      <CardActions className="justify-end">
        <Button size="small" onClick={() => onView(project)}>
          View
        </Button>
        <Button size="small" onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(project.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;