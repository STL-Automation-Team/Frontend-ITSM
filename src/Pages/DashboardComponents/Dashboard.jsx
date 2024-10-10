import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import Sidenav from '../../Components/Sidenav';
import Navbar from '../../Components/Navbar';
import DashboardCards from './DashboardCards';


export default function Dashboard() {
  

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="bg-color">
        <Navbar />
        <Box height={60} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DashboardCards />
            {/* <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid> */}
            {/* <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RevenueBarChart startDate={startDate} endDate={endDate} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InvoiceVsAreaMonthwise startDate={startDate} endDate={endDate} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RevenueVsAreaMonthwise startDate={startDate} endDate={endDate} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CostBarChart startDate={startDate} endDate={endDate} />
              </Grid>
            </Grid> */}
          </Box>
        </Box>
      </div>
    // </LocalizationProvider>
  );
}


