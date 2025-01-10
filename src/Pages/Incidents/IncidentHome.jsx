import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ViewIncident from "./ViewIncident";
import { useLocation } from 'react-router-dom';
import { useAuth } from "../../Components/AuthProvider";
import axios from 'axios';
import AxiosInstance from "../../Components/AxiosInstance";

export default function IncidentHome() {
  const { userRoles } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightedRefId = queryParams.get("highlight");
  const isUserRole = userRoles.includes('User');

  // State to store the number of incidents
  const [incidentCount, setIncidentCount] = useState(0);
  // const [incidentStatus, setIncidentStatus] = useState('New');

  // Effect to fetch incident count
  // useEffect(() => {
  //   // Only fetch if the user is not a 'User' role
  //   if (!isUserRole) {
  //     const fetchIncidentCount = async () => {
  //       try {
  //         const response = await AxiosInstance.get('http://10.100.130.76:3000/api/v1/incidents/incidents_details', {
  //           params: { status: incidentStatus }
  //         });
          
  //         // Assuming the response contains an array of incidents
  //         // Adjust this based on the exact structure of your API response
  //         setIncidentCount(response.data.length || 0);
  //       } catch (error) {
  //         console.error('Error fetching incident count:', error);
  //         setIncidentCount(0);
  //       }
  //     };

  //     fetchIncidentCount();
  //   }
  // }, [isUserRole, incidentStatus]); // Added incidentStatus to dependency array

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, display: "grid", gap: 3 }}>
        {/* Render only if the user is NOT a 'User' */}
        {!isUserRole && (
          <>
            <Box>
              <h2 style={{ margin: "0 0 10px 0", color: 'Black' }}>
                All Incidents 
                <span style={{ 
                  marginLeft: '10px', 
                  backgroundColor: '#f0f0f0', 
                  padding: '2px 1px', 
                  borderRadius: '12px', 
                  fontSize: '0.8em' 
                }}>
                  {/* {incidentStatus}- {incidentCount} */}
                </span>
              </h2>
              <ViewIncident highlightedRefId={highlightedRefId} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
}