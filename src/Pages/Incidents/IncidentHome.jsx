import React from "react";
import Box from "@mui/material/Box";
import ViewIncident from "./ViewIncident";
import MyAssignedIncidents from "./MyAssignedIncidents";
import { useLocation } from 'react-router-dom';
import MyCreatedIncidents from "./MyCreatedIncidents";
import { useAuth } from "../../Components/AuthProvider";

export default function IncidentHome() {
  const { userRoles } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightedRefId = queryParams.get("highlight");
  const isUserRole = userRoles.includes('User');

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, display: "grid", gap: 3 }}>
        {/* Render only if the user is NOT a 'User' */}
        {!isUserRole && (
          <>
            <Box>
              <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>All Incidents</h2>
              <ViewIncident highlightedRefId={highlightedRefId} />
            </Box>
            <Box>
              <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>Assigned Incidents</h2>
              <MyAssignedIncidents />
            </Box>
          </>
        )}

        {/* Always render 'My Created Incidents' */}
        <Box>
          <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>My Created Incidents</h2>
          <MyCreatedIncidents />
        </Box>
      </Box>
    </>
  );
}
