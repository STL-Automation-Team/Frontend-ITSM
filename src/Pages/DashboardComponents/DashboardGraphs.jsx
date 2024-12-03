import React, { useMemo } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { styled } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  backgroundColor: '#ffffff',
  height: '350px',
  display: 'flex',
  flexDirection: 'column',
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(1.5),
  color: '#333',
}));


const getDatasets = (label1Data, label2Data, colors) => [
  {
    label: 'Incidents',
    data: label1Data,
    backgroundColor: colors[0],
    borderRadius: 4,
  },
  {
    label: 'Services',
    data: label2Data,
    backgroundColor: colors[1],
    borderRadius: 4,
  },
];


export default function DashboardGraphs({ 
  incidentsData, 
  servicesData, 
  priorities, 
  statuses, 
  departments 
}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5
      }
    },
  };

  const createDepartmentData = useMemo(() => {
    if (!departments?.length || !incidentsData?.incidents_by_department || !servicesData?.requests_by_department) {
      return null;
    }
    
    const labels = departments.map(dept => dept.name);
    const incidentData = departments.map(dept => 
      incidentsData.incidents_by_department[dept.id] || 0
    );
    const serviceData = departments.map(dept => 
      servicesData.requests_by_department[dept.id] || 0
    );
  
    return {
      labels,
      datasets: getDatasets(incidentData, serviceData, ['#2196f3', '#4caf50'])
    };
  }, [departments, incidentsData?.incidents_by_department, servicesData?.requests_by_department]);

  
  const createPriorityData = useMemo(() => {
    if (!priorities?.length || !incidentsData?.incidents_by_priority || !servicesData?.requests_by_priority) {
      return null;
    }
    
    const labels = priorities.map(priority => priority.name);
    const incidentData = labels.map(label => 
      incidentsData.incidents_by_priority[label] || 0
    );
    const serviceData = labels.map(label => 
      servicesData.requests_by_priority[label] || 0
    );

    return {
      labels,
      datasets: getDatasets(incidentData, serviceData, ['#ff9800', '#f44336'])
    };
  }, [priorities, incidentsData?.incidents_by_priority, servicesData?.requests_by_priority]);

  
  const createStatusData = useMemo(() => {
    if (!statuses?.length || !incidentsData?.incidents_by_status || !servicesData?.requests_by_status) {
      return null;
    }
    
    const labels = statuses.map(status => status.name);
    const incidentData = labels.map(label => 
      incidentsData.incidents_by_status[label] || 0
    );
    const serviceData = labels.map(label => 
      servicesData.requests_by_status[label] || 0
    );

    return {
      labels,
      datasets: getDatasets(incidentData, serviceData, ['#673ab7', '#2196f3'])
    };
  }, [statuses, incidentsData?.incidents_by_status, servicesData?.requests_by_status]);

  
  const ChartComponent = ({ data, title }) => {
    if (!data) {
      return (
        <StyledPaper>
          <ChartTitle variant="h6">{title}</ChartTitle>
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary">Loading data...</Typography>
          </Box>
        </StyledPaper>
      );
    }

    return (
      <StyledPaper>
        <ChartTitle variant="h6">{title}</ChartTitle>
        <Box sx={{ flexGrow: 1 }}>
          <Bar options={options} data={data} />
        </Box>
      </StyledPaper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <ChartComponent 
          data={createStatusData}
          title="By Status"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <ChartComponent 
          data={createPriorityData}
          title="By Priority"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <ChartComponent 
          data={createDepartmentData}
          title="By Department"
        />
      </Grid>
    </Grid>
  );
}