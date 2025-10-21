import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { TaskCreate } from '../../types/task';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: TaskCreate) => void;
  initialData?: Partial<TaskCreate>;
  title?: string;
}

const TASK_STATUS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' },
] as const;

const TASK_PRIORITY = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  title = 'Add Task',
}) => {
  const [formData, setFormData] = React.useState<TaskCreate>({
    projectId: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignedTo: [],
    startDate: '',
    dueDate: '',
    dependencies: [],
    progress: 0,
    ...initialData,
  });

  React.useEffect(() => {
    setFormData((prev: TaskCreate) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  setFormData((prev: TaskCreate) => ({
      ...prev,
      [name]: name === 'progress' ? Number(value) : value,
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
          <div className="grid gap-4 mt-2 grid-cols-1 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <TextField
                name="title"
                label="Task Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                required
              />
            </div>

            <div>
              <TextField
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {TASK_STATUS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
              <TextField
                name="priority"
                label="Priority"
                value={formData.priority}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {TASK_PRIORITY.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div>
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
            </div>

            <div>
              <TextField
                name="dueDate"
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
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

export default TaskForm;
