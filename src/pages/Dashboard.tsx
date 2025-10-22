import React, { useEffect } from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
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
  const sortedByBudget = [...projects].sort((a: Project, b: Project) => b.budget - a.budget);
  
  const budgetData = {
    labels: sortedByBudget
      .slice(0, 6)
      .map((p: Project) => p.name.substring(0, 15)),
    datasets: [
      {
        label: 'Budget (NOK)',
        data: sortedByBudget
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
      style={{ flex: '1 1 150px', minWidth: '150px', maxWidth: '200px' }}
    >
      <Card 
        sx={{ 
          height: '110px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 3,
          borderRadius: 2,
          transition: 'box-shadow 0.2s',
        }}
      >
        <CardContent sx={{ width: '100%', py: 1.5, px: 1, textAlign: 'center' }}>
          <Box
            className="rounded-full mx-auto mb-1"
            style={{ 
              backgroundColor: `${color}20`,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon style={{ fontSize: 24, color }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom className="mb-6">
          Dashboard
        </Typography>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div 
        style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}
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
        <StatCard
          title="Total"
          value={stats.total}
          icon={ProjectIcon}
          color="#1976d2"
        />
        <StatCard
          title="Planning"
          value={stats.planning}
          icon={ProjectIcon}
          color="#2196f3"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingIcon}
          color="#ff9800"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={MoneyIcon}
          color="#4caf50"
        />
        <StatCard
          title="On Hold"
          value={stats.onHold}
          icon={WarningIcon}
          color="#f44336"
        />
        <StatCard
          title="Avg Progress"
          value={`${stats.avgProgress}%`}
          icon={TrendingIcon}
          color="#9c27b0"
        />
      </motion.div>

      {/* Total Budget Card */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card 
          sx={{ 
            bgcolor: 'success.main', 
            color: 'white',
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Total Budget (All Projects)
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatBudget(stats.totalBudget)}
                </Typography>
              </Box>
              <MoneyIcon sx={{ fontSize: 56, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div 
        className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
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
      </motion.div>

      {/* Budget Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
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
      </motion.div>
    </Box>
  );
};

export default Dashboard;
