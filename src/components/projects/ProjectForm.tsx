import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { Project, ProjectCreate } from '../../types/project';

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectCreate) => void;
  initialData?: Project;
  title?: string;
}

const PROJECT_STATUS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
] as const;

const ProjectForm: React.FC<ProjectFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = 'Create Project',
}) => {
  const [formData, setFormData] = React.useState<ProjectCreate>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    budget: 0,
    location: '',
    manager: '',
    progress: 0,
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ProjectCreate) => ({
      ...prev,
      [name]: name === 'budget' || name === 'progress' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div className="mt-2 space-y-4">
            <TextField
              name="name"
              label="Project Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                name="startDate"
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="endDate"
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {PROJECT_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                name="budget"
                label="Budget"
                type="number"
                value={formData.budget}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: '$',
                }}
              />
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="manager"
                label="Project Manager"
                value={formData.manager}
                onChange={handleChange}
                fullWidth
                required
              />
            </div>
            <TextField
              name="progress"
              label="Progress (%)"
              type="number"
              value={formData.progress}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                inputProps: {
                  min: 0,
                  max: 100,
                },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm;