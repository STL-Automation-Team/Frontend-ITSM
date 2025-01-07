import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Box
} from '@mui/material';

const IncidentAgingTable = () => {
  const [agingData, setAgingData] = useState({});
  const [loading, setLoading] = useState(true);

  const statuses = [
    'New',
    'In Progress',
    'Hold with OEM',
    'Hold with Customer',
    'Reassignment/Forward',
    'Resolve',
    'Close',
  ];

  const ageRanges = [
    { min: 0, max: 7, label: '0 to 7 days' },
    { min: 8, max: 15, label: '8 to 15 days' },
    { min: 16, max: 31, label: '16 to 31 days' },
    { min: 32, max: 60, label: '32 to 60 days' },
    { min: 61, max: 100, label: '61 to 100 days' },
    { min: 101, max: 365, label: '101 to 365 days' },
  ];

  const calculateDateRange = (min, max) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of current day
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - max);
    startDate.setHours(0, 0, 0, 0); // Start of day
    
    const endDate = new Date(now);
    endDate.setDate(now.getDate() - min);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  const fetchAgingData = async () => {
    setLoading(true);
    try {
      const results = {};

      for (const status of statuses) {
        results[status] = {};
        for (const range of ageRanges) {
          const { startDate, endDate } = calculateDateRange(range.min, range.max);
          
          try {
            const response = await fetch(`/api/v1/incidents/incidents_details?skip=0&limit=1000&status=${status}&start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();
            results[status][range.label] = data.total_records || 0;
          } catch (error) {
            console.error(`Error fetching data for ${status} and range ${range.label}:`, error);
            results[status][range.label] = 0;
          }
        }
      }

      setAgingData(results);
    } catch (error) {
      console.error('Error fetching aging data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgingData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAgingData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTotal = (status) => {
    if (!agingData[status]) return 0;
    return Object.values(agingData[status]).reduce((sum, count) => sum + count, 0);
  };

  if (loading && !Object.keys(agingData).length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 2, borderRadius: 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            {ageRanges.map((range) => (
              <TableCell 
                key={range.label} 
                align="center"
                sx={{ fontWeight: 'bold' }}
              >
                {range.label}
              </TableCell>
            ))}
            <TableCell 
              align="center"
              sx={{ fontWeight: 'bold' }}
            >
              Grand Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statuses.map((status) => (
            <TableRow 
              key={status}
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <TableCell sx={{ fontWeight: 500 }}>{status}</TableCell>
              {ageRanges.map((range) => (
                <TableCell key={range.label} align="center">
                  {loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    agingData[status]?.[range.label] || 0
                  )}
                </TableCell>
              ))}
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {loading ? (
                  <CircularProgress size={16} />
                ) : (
                  getTotal(status)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IncidentAgingTable;