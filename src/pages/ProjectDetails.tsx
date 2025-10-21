import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProjects } from '../features/projects/projectSlice';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { taskService } from '../services/taskService';
import { resourceService } from '../services/resourceService';
import { Task } from '../types/task';
import { Resource } from '../types/resource';
import TaskForm from '../components/tasks/TaskForm';
import { TaskCreate, TaskUpdate } from '../types/task';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const project = projects.find((p) => p.id === id);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [tasksLoading, setTasksLoading] = React.useState(false);
  const [resourcesLoading, setResourcesLoading] = React.useState(false);
  const [tasksError, setTasksError] = React.useState<string | null>(null);
  const [resourcesError, setResourcesError] = React.useState<string | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  React.useEffect(() => {
    if (project) {
      setTasksLoading(true);
      setTasksError(null);
      taskService.getTasksByProject(project.id)
        .then(setTasks)
        .catch((err) => setTasksError((err as Error).message))
        .finally(() => setTasksLoading(false));

      setResourcesLoading(true);
      setResourcesError(null);
      resourceService.getResourcesByProject(project.id)
        .then(setResources)
        .catch((err) => setResourcesError((err as Error).message))
        .finally(() => setResourcesLoading(false));
    }
  }, [project]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      taskService.deleteTask(taskId).then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      });
    }
  };

  const handleSubmitTask = (taskData: TaskCreate) => {
    if (editingTask) {
      // Update
      taskService.updateTask(editingTask.id, { ...editingTask, ...taskData } as TaskUpdate).then((updated) => {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      });
    } else {
      // Create
      taskService.createTask({ ...taskData, projectId: project!.id }).then((created) => {
        setTasks((prev) => [...prev, created]);
      });
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return <Box className="flex justify-center"><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!project) {
    return <Alert severity="warning">Project not found.</Alert>;
  }

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate(-1)} className="mb-4">Back</Button>
      <Typography variant="h4" gutterBottom>{project.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>Status: {project.status}</Typography>
      <Typography variant="body1" gutterBottom>Description: {project.description}</Typography>
      <Typography variant="body2" gutterBottom>Start: {project.startDate}</Typography>
      <Typography variant="body2" gutterBottom>End: {project.endDate}</Typography>
      <Typography variant="body2" gutterBottom>Budget: ${project.budget.toLocaleString()}</Typography>
      <Typography variant="body2" gutterBottom>Location: {project.location}</Typography>
      <Typography variant="body2" gutterBottom>Manager: {project.manager}</Typography>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Tasks</Typography>
        <Button variant="contained" color="primary" onClick={handleAddTask} className="mb-2">Add Task</Button>
        {tasksLoading ? (
          <CircularProgress />
        ) : tasksError ? (
          <Alert severity="error">{tasksError}</Alert>
        ) : tasks.length === 0 ? (
          <Typography>No tasks found for this project.</Typography>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} - {task.status}
                <Button size="small" onClick={() => handleEditTask(task)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        )}
        <TaskForm
          open={isTaskFormOpen}
          onClose={() => { setIsTaskFormOpen(false); setEditingTask(null); }}
          onSubmit={handleSubmitTask}
          initialData={editingTask || { projectId: project!.id }}
          title={editingTask ? 'Edit Task' : 'Add Task'}
        />
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Resources</Typography>
        {resourcesLoading ? (
          <CircularProgress />
        ) : resourcesError ? (
          <Alert severity="error">{resourcesError}</Alert>
        ) : resources.length === 0 ? (
          <Typography>No resources found for this project.</Typography>
        ) : (
          <ul>
            {resources.map((resource) => (
              <li key={resource.id}>{resource.name} - {resource.type}</li>
            ))}
          </ul>
        )}
      </Box>
    </Box>
  );
};

export default ProjectDetails;
