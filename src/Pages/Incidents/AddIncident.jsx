import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Box, Typography } from '@mui/material';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import Sidenav from '../../Components/Sidenav';

const AddIncident = () => {
  const [formData, setFormData] = useState({
    caller_name: '',
    location: '',
    category: '',
    priority: '',
    title: '',
    description: '',
    attachments: '',
    status: 'OPEN',
    sla_status: 'NOT BREACHED',
    department_id: '',
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://10.100.130.76:3000/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      
      <TextField
        fullWidth
        margin="normal"
        label="Caller Name"
        name="caller_name"
        value={formData.caller_name}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Location"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Attachments"
        name="attachments"
        value={formData.attachments}
        onChange={handleChange}
      />

      <FormControl component="fieldset" margin="normal">
        <Typography>Status</Typography>
        <RadioGroup
          name="status"
          value={formData.status}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="OPEN" control={<Radio />} label="Open" />
          <FormControlLabel value="CLOSED" control={<Radio />} label="Closed" />
          <FormControlLabel value="PENDING" control={<Radio />} label="Pending" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" margin="normal">
        <Typography>SLA Status</Typography>
        <RadioGroup
          name="sla_status"
          value={formData.sla_status}
          onChange={handleChange}
          row
        >
          <FormControlLabel value="BREACHED" control={<Radio />} label="Breached" />
          <FormControlLabel value="NOT BREACHED" control={<Radio />} label="Not Breached" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Department</InputLabel>
        <Select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          required
        >
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

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