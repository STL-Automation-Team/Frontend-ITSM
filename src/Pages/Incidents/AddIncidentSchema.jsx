import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Box, Typography } from '@mui/material';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Sidenav from '../../Components/Sidenav';
import FormSchema from './incident_schema.json';
import FormUISchema from './incident_uischema.json';

import { person } from '@jsonforms/examples';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';



const AddIncident = () => {
  const [formData, setFormData] = useState(person.data);

  const schema = FormSchema;
  const uischema = FormUISchema;


  useEffect(() => {
    //fetchDepartments();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://10.100.130.76:3000/api/v1/incidents/', formData);
      console.log('Incident created:', response.data);
      // Reset form or show success message
    } catch (error) {
      console.error('Error creating incident:', error);
      // Show error message
    }
  };

  return (
    <>
    <Navbar />
        <Box height={30} />
        <Box sx={{ display: "flex" }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3, display: "grid" }}>
            <h1>Add Incident</h1>
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h4" gutterBottom>Create Incident</Typography>
      
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => setFormData(data)}
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Save Incident
      </Button>
    </Box>
    </Box>
        </Box>
    </>
  );
};

export default AddIncident;