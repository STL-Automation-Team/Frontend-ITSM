import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import AxiosInstance from '../../Components/AxiosInstance';

export default function UserProfile() {
  const [userData, setUserData] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    status: '',
    email: '',
    contact_number: '',
    department_id: '',
  });
  const contactId = localStorage.getItem('contact_id'); // Assuming contact_id is stored in localStorage.

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosInstance.get(
          `http://10.100.130.76:3000/contact/${contactId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [contactId]);

  return (
    <Box
      sx={{
        height: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f5f5f5',
        padding: 2,
      }}
    >
      <Paper sx={{ padding: 4, borderRadius: 8, maxWidth: 600, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
          User Profile
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={userData.firstname}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Middle Name"
              value={userData.middlename || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={userData.lastname}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              value={userData.status}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={userData.email}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Number"
              value={userData.contact_number}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Department"
              value={userData.department_name}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert('Feature Coming Soon!')}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
