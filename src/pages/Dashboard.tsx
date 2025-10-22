import React, { useEffect } from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
} from 'chart.js';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchProjects } from '../features/projects/projectSlice';
import {
  Folder as ProjectIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Project } from '../types/project';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title
);

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: projects.length,
    planning: projects.filter((p: Project) => p.status === 'planning').length,
    inProgress: projects.filter((p: Project) => p.status === 'in-progress').length,
    completed: projects.filter((p: Project) => p.status === 'completed').length,
    onHold: projects.filter((p: Project) => p.status === 'on-hold').length,
    totalBudget: projects.reduce((sum, p: Project) => sum + (p.budget || 0), 0),
    avgProgress: projects.length > 0
      ? Math.round(projects.reduce((sum, p: Project) => sum + (p.progress || 0), 0) / projects.length)
      : 0,
  };

  // Format Norwegian currency
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Chart data
  const pieData = {
    labels: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    datasets: [
      {
        label: 'Projects by Status',
        data: [stats.planning, stats.inProgress, stats.completed, stats.onHold],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: projects.slice(0, 5).map((p: Project) => p.name.substring(0, 20)),
    datasets: [
      {
        label: 'Progress (%)',
        data: projects.slice(0, 5).map((p: Project) => p.progress || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Budget comparison data
  const budgetData = {
    labels: projects
      .sort((a: Project, b: Project) => b.budget - a.budget)
      .slice(0, 6)
      .map((p: Project) => p.name.substring(0, 15)),
    datasets: [
      {
        label: 'Budget (NOK)',
        data: projects
          .sort((a: Project, b: Project) => b.budget - a.budget)
          .slice(0, 6)
          .map((p: Project) => p.budget / 1000000), // Convert to millions
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent>
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            className="rounded-full p-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon style={{ fontSize: 32, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-64">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom className="mb-6">
        Dashboard
      </Typography>

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Projects"
          value={stats.total}
          icon={ProjectIcon}
          color="#1976d2"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingIcon}
          color="#ff9800"
        />
        <StatCard
          title="Total Budget"
          value={formatBudget(stats.totalBudget)}
          icon={MoneyIcon}
          color="#4caf50"
        />
        <StatCard
          title="Avg Progress"
          value={`${stats.avgProgress}%`}
          icon={WarningIcon}
          color="#f44336"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Projects by Status
            </Typography>
            <Box className="flex justify-center" style={{ height: '300px' }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Projects Progress
            </Typography>
            <Box style={{ height: '300px' }}>
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Budget Comparison Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Projects by Budget (Millions NOK)
          </Typography>
          <Box style={{ height: '350px' }}>
            <Bar
              data={budgetData}
              options={{
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Budget (Million NOK)',
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
