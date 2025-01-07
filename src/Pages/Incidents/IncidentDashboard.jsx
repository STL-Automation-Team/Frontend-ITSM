import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import DashboardCards from "../DashboardComponents/DashboardCards";
import DashboardGraphs from "../DashboardComponents/DashboardGraphs";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AxiosInstance from "../../Components/AxiosInstance";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  height: "48px",
  backgroundColor: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  marginBottom: theme.spacing(2),
  backgroundColor: "#fff",
}));

export default function IncidentDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusCounts, setStatusCounts] = useState({
    new: 0,
    inProgress: 0,
    holdWithCustomer: 0,
    reassigned: 0
  });
  const [incidentsData, setIncidentsData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchStatusCount = async (status) => {
    try {
      const response = await AxiosInstance.get(`/incidents/incidents_details`, {
        params: {
          skip: 0,
          limit: 10,
          status: status
        }
      });
      return response.data.total_records;
    } catch (error) {
      console.error(`Error fetching ${status} count:`, error);
      return 0;
    }
  };

  const fetchAllStatusCounts = async () => {
    try {
      const [newCount, inProgressCount, holdCount, reassignedCount] = await Promise.all([
        fetchStatusCount('New'),
        fetchStatusCount('In Progress'),
        fetchStatusCount('Hold with Customer'),
        fetchStatusCount('Reassigned')
      ]);

      setStatusCounts({
        new: newCount,
        inProgress: inProgressCount,
        holdWithCustomer: holdCount,
        reassigned: reassignedCount
      });
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [prioritiesRes, statusesRes, departmentsRes] = await Promise.all([
        AxiosInstance.get(`/priority`),
        AxiosInstance.get(`/statuses`),
        AxiosInstance.get(`/departments`),
      ]);

      setPriorities(prioritiesRes.data);
      setStatuses(statusesRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  const fetchData = async (start, end) => {
    try {
      const params = start && end ? { start_date: start, end_date: end } : {};

      const [incidentsRes, servicesRes] = await Promise.all([
        AxiosInstance.get(`/incidents-dashboard`, { params }),
        AxiosInstance.get(`/service-request-dashboard`, { params }),
      ]);

      setIncidentsData(incidentsRes.data);
      setServicesData(servicesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchReferenceData();
    fetchData();
    fetchAllStatusCounts();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    } else {
      alert("Please select both start and end dates");
    }
  };

  const getCardData = () => {
    return [
      {
        title: "New Incidents",
        value: statusCounts.new,
        color: "#2196f3",
        icon: <AssignmentIcon sx={{ fontSize: 35, color: '#fff' }} />
      },
      {
        title: "In Progress",
        value: statusCounts.inProgress,
        color: "#4caf50",
        icon: <PlayArrowIcon sx={{ fontSize: 35, color: '#fff' }} />
      },
      {
        title: "Hold with Customer",
        value: statusCounts.holdWithCustomer,
        color: "#f44336",
        icon: <PauseIcon sx={{ fontSize: 35, color: '#fff' }} />
      },
      {
        title: "Reassigned",
        value: statusCounts.reassigned,
        color: "#ff9800",
        icon: <SwapHorizIcon sx={{ fontSize: 35, color: '#fff' }} />
      },
    ];
  };

  return (
    <Box sx={{ padding: "0.5rem 0" }}>
      <Typography sx={{marginBottom:'10px', color: 'black', fontWeight:'bold', fontSize:'20px'}}>Dashboard</Typography>
      <FilterContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} sx={{ pr: 1 }}>
            <StyledTextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ px: 1 }}>
            <StyledTextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ pl: 1 }}>
            <FilterButton variant="contained" onClick={handleFilter} fullWidth>
              Apply Filter
            </FilterButton>
          </Grid>
        </Grid>
      </FilterContainer>
  
      <Box sx={{ '& > *': { mb: 2 } }}>
        <DashboardCards cards={getCardData()} />
        {incidentsData && servicesData && (
          <DashboardGraphs
            incidentsData={incidentsData}
            servicesData={servicesData}
            priorities={priorities}
            statuses={statuses}
            departments={departments}
          />
        )}
      </Box>
    </Box>
  );
}