import React from 'react';
import { Box, Typography } from '@mui/material';

const ContactDetails = ({ contact }) => {
  if (!contact) return <Box p={2}>Loading contact details...</Box>;
  
  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Contact Details</Typography>
      <Typography>Name: {contact.name}</Typography>
      <Typography>Email: {contact.email}</Typography>
      {/* Add other contact details as needed */}
    </Box>
  );
};

export default ContactDetails;