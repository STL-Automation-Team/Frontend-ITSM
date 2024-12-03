import React from "react";
import Box from "@mui/material/Box";
import ViewIncident from "./ViewIncident";
// import { DataContextProvider } from "../../Components/DataContext";

export default function IncidentHome() {
  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, display: "grid" }}>
        <h2 style={{margin: "0", color: 'Black'}}>Incidents</h2>
        {/* <DataContextProvider> */}
          <ViewIncident />
        {/* </DataContextProvider> */}
      </Box>
    </>
  );
}
