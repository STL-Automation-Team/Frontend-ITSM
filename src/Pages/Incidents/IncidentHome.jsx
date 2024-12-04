import React from "react";
import Box from "@mui/material/Box";
import ViewIncident from "./ViewIncident";
import MyAssignedIncidents from "./MyAssignedIncidents";
import { useLocation } from 'react-router-dom';


export default function IncidentHome() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightedRefId = queryParams.get("highlight");

  return (
    <Box component="main" sx={{ flexGrow: 1, display: "grid", gap: 3 }}>
      <Box>
        <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>All Incidents</h2>
        <ViewIncident highlightedRefId={highlightedRefId} />
      </Box>
      <Box>
        <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>Assigned Incidents</h2>
        <MyAssignedIncidents />
      </Box>
    </Box>
  );
}
