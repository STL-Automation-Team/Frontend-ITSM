import React from 'react';
import { Grid, Typography, Skeleton, Box } from '@mui/material';

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

const UserDetails = ({ userData }) => {
  const detailStyle = {
    display: 'flex',
    marginBottom: '12px',
    alignItems: 'center',
  };

  const labelStyle = {
    fontWeight: 600,
    color: colors.text.secondary,
    width: '130px',
    fontSize: '18px',
    letterSpacing: '0.1px',
  };

  const valueStyle = {
    color: colors.text.primary,
    fontSize: '16px',
    fontWeight: 500,
  };

  if (!userData) return null;

  return (
    <Box sx={{ py: 1.5, px: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {[
            { label: 'Name', value: userData.name },
            { label: 'Email', value: userData.email },
            { label: 'Contact', value: userData.contact_number }
          ].map((item, index) => (
            <Box key={index} sx={detailStyle}>
              <Typography sx={labelStyle}>{item.label}</Typography>
              <Typography sx={valueStyle}>{item.value}</Typography>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} sm={6}>
          {[
            { label: 'Department', value: userData.department_id },
            { label: 'Status', value: userData.status }
          ].map((item, index) => (
            <Box key={index} sx={detailStyle}>
              <Typography sx={labelStyle}>{item.label}</Typography>
              <Typography sx={valueStyle}>{item.value}</Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;