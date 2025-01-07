import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Grid, CircularProgress, Alert, Typography, Button } from '@mui/material';
import EditIncidentForm from './EditIncidentForm';
import CommunicationLogs from './CommunicationLogs';
import AxiosInstance from '../../Components/AxiosInstance';

const ViewIncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [formRef, setFormRef] = useState(null);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get(`/incidents/incident_details/${id}`);
        setIncident(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching incident details:', error);
        setError('Failed to load incident details');
        setLoading(false);
      }
    };

    fetchIncidentDetails();
  }, [id]);

  const handleIncidentUpdate = (updatedIncident) => {
    setIncident(updatedIncident);
    // Increment update trigger to refresh logs
    setUpdateTrigger(prev => prev + 1);
    // Optional: Navigate back to incidents list or show a success message
    navigate('/incidents');
  };

  const handleSubmit = () => {
    if (formRef) {
      formRef.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            sx={{marginBottom:'10px', color: 'black', fontWeight:'bold', fontSize:'20px'}}
          >
            Edit Incident
          </Typography>
          <Paper 
            elevation={0} 
            sx={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
            }}
          >
            {incident && (
              <EditIncidentForm
                incidentData={incident}
                onSubmit={handleIncidentUpdate}
                formRef={setFormRef}
              />
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={1}>
            {incident && (
              <CommunicationLogs 
                incidentId={id} 
                onIncidentUpdate={() => updateTrigger}
                onSubmit={handleSubmit}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewIncidentDetails;