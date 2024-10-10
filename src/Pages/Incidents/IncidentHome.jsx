import React from 'react';
import Sidenav from '../../Components/Sidenav';
import Box from '@mui/material/Box';
import Navbar from '../../Components/Navbar';
import ViewIncident from "./ViewIncident"


export default function IncidentHome() {
  return (
    <>
      <div className="bg-color">
        <Navbar />
        <Box height={40} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3, display: "grid" }}>
            <h2>Incidents</h2>
            <ViewIncident />
          </Box>
        </Box>
      </div>
    </>
  )
}
