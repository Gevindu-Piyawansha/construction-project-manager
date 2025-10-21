import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper className="p-4">
          <Typography variant="h6">Active Projects</Typography>
          <Typography variant="h4">0</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper className="p-4">
          <Typography variant="h6">Pending Tasks</Typography>
          <Typography variant="h4">0</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper className="p-4">
          <Typography variant="h6">Available Resources</Typography>
          <Typography variant="h4">0</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Paper className="p-4">
          <Typography variant="h6">Total Projects</Typography>
          <Typography variant="h4">0</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;