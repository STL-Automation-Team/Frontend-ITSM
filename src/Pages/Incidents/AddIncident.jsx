import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import IncidentForm from './IncidentForm';
import AxiosInstance from '../../Components/AxiosInstance';



const colors = {
  primary: '#2196f3',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  text: {
    primary: '#2c3345',
    secondary: '#6b7280',
  },
  background: {
    paper: '#ffffff',
    default: '#f8fafc',
  }
};


const AddIncident = () => {
  const [userData, setUserData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchDepartments();
  }, []);

  const fetchUserData = async () => {
    try {
      const contactId = localStorage.getItem('contact_id');
      if (!contactId) {
        throw new Error('Contact ID not found in localStorage');
      }
      const response = await AxiosInstance.get(`http://10.100.130.76:3000/contact/${contactId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await AxiosInstance.get('http://10.100.130.76:3000/departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to load departments');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await AxiosInstance.post('http://10.100.130.76:3000/api/v1/incidents/', formData);
      alert('Incident reported successfully!');
    } catch (error) {
      console.error('Error submitting incident:', error);
      // alert('Failed to submit incident. Please try again.');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ height:'100%'}}>
      <Typography
       sx={{marginBottom:'10px', color: 'black', fontWeight:'bold', fontSize:'20px'}}
      >
        New Incident
      </Typography>
      
      {/* <Paper 
        elevation={0} 
        sx={{ 
          mb: 2,
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      >
        {userData && <UserDetails userData={userData} />}
      </Paper> */}
      
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        <IncidentForm 
          departments={departments} 
          onSubmit={handleSubmit} 
          defaultContactId={userData?.id} 
        />
      </Paper>
    </Box>
  );
};

export default AddIncident;

