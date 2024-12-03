import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

const IncidentAddSuccessAlert = ({ open, onClose, incidentNumber, onViewDetails }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: '8px',
          p: 3,
          maxWidth: '400px',
          width: '90%',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon
            sx={{ color: '#4CAF50', fontSize: 24, mr: 1 }}
          />
          <Typography variant="h6" component="div">
            Your incident has been created successfully
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Incident Number: <span style={{ color: '#2196f3' }}>{incidentNumber}</span>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onViewDetails}
            sx={{
              bgcolor: '#6C5CE7',
              '&:hover': { bgcolor: '#5A4BD1' },
              textTransform: 'none',
            }}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              color: 'text.primary',
              borderColor: '#E0E0E0',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default IncidentAddSuccessAlert;