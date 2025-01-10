import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, TextField, FormControl, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import AxiosInstance from '../../Components/AxiosInstance';

export default function IncidentReports() {
  const [statuses, setStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await AxiosInstance.get('http://10.100.130.76:3000/api/v1/statuses');
        setStatuses(response.data || []);
        setSelectedStatuses(response.data.map((status) => status.id)); // Select all by default
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    const defaultEndDate = new Date().toISOString().split('T')[0];
    const defaultStartDate = new Date();
    defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
    setStartDate(defaultStartDate.toISOString().split('T')[0]);
    setEndDate(defaultEndDate);
  }, []);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      if (selectedStatuses.length === statuses.length) {
        setSelectedStatuses([]); // Unselect all
      } else {
        setSelectedStatuses(statuses.map((status) => status.id)); // Select all
      }
    } else {
      setSelectedStatuses(value);
    }
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      if (selectedStatuses.length) {
        const statusNames = statuses
          .filter((s) => selectedStatuses.includes(s.id))
          .map((s) => s.name)
          .join(',');
        queryParams.append('status', statusNames);
      }

      const response = await AxiosInstance.get(
        `http://10.100.130.76:3000/api/v1/incidents/incidents_report?${queryParams.toString()}`,
        {
          responseType: 'blob', // Important for file downloads
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `incidents_report_${startDate}_${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  return (
    <>
    <h2 style={{ margin: "0 0 10px 0", color: 'Black' }}>
    Select Filters  for Customizable Incident Reports
      <span style={{ 
        marginLeft: '10px', 
        backgroundColor: '#f0f0f0', 
        padding: '2px 1px', 
        borderRadius: '12px', 
        fontSize: '0.5em' 
      }}>
        {/* {incidentStatus}- {incidentCount} */}
      </span>
    </h2>
    <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', width: '95rem' }}>
      <Paper sx={{ borderRadius: '8px', padding: 2, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <Select
              multiple
              value={selectedStatuses}
              onChange={handleStatusChange}
              renderValue={(selected) =>
                selected.length === statuses.length
                  ? 'All'
                  : statuses
                      .filter((s) => selected.includes(s.id))
                      .map((s) => s.name)
                      .join(', ')
              }
            >
              <MenuItem value="all">
                <Checkbox checked={selectedStatuses.length === statuses.length} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  <Checkbox checked={selectedStatuses.includes(status.id)} />
                  <ListItemText primary={status.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Button
        variant="contained"
        onClick={handleDownload}
        sx={{
          bgcolor: '#1976d2',
          '&:hover': { bgcolor: '#1565c0' },
        }}
      >
        Download Report
      </Button>
    </Box>
    </>
  );
}
