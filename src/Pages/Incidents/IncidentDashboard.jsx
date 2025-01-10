import AssignmentIcon from '@mui/icons-material/Assignment';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import DashboardCards from "../DashboardComponents/DashboardCards";
import DashboardGraphs from "../DashboardComponents/DashboardGraphs";
import IncidentAgingTable from './IncidentAgingTable';

// Styled components remain the same
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

// Utility function to get financial year start date and today's date
const getDefaultDates = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
  
  // If current month is before April, financial year started in previous year
  const year = currentMonth < 4 ? currentYear - 1 : currentYear;
  
  // Create date string directly in YYYY-MM-DD format
  const financialYearStart = `${year}-04-01`;
  const todayFormatted = today.toISOString().split('T')[0];

  return {
    startDate: financialYearStart,
    endDate: todayFormatted
  };
};

export default function IncidentDashboard() {
  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [statusCounts, setStatusCounts] = useState({
    new: 0,
    inProgress: 0,
    holdWithCustomer: 0,
    close: 0
  });
  const [incidentsData, setIncidentsData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dateError, setDateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const fetchStatusCount = async (status) => {
    try {
      const response = await AxiosInstance.get(`/incidents/incidents_details`, {
        params: {
          skip: 0,
          limit: 300,
          status: status,
          start_date: startDate,
          end_date: endDate
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
      const [newCount, inProgressCount, holdCount, closeCount] = await Promise.all([
        fetchStatusCount('New'),
        fetchStatusCount('In Progress'),
        fetchStatusCount('Hold with Customer'),
        fetchStatusCount('Close')
      ]);

      setStatusCounts({
        new: newCount,
        inProgress: inProgressCount,
        holdWithCustomer: holdCount,
        close: closeCount
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

  const validateDates = (start, end) => {
    // Clear previous error
    setDateError("");

    // Convert string dates to Date objects for comparison
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const today = new Date();
    const maxDate = new Date(today.getFullYear() + 1, 11, 31); // Max date is end of next year

    // Check if dates are valid
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      setDateError("Please enter valid dates");
      return false;
    }

    // Check if end date is before start date
    if (endDateObj < startDateObj) {
      setDateError("End date must be after start date");
      return false;
    }

    // Check if end date is in the future
    if (endDateObj > today) {
      setDateError("End date cannot be in the future");
      return false;
    }

    // Check if date range is more than 5 years
    const fiveYearsInMs = 5 * 365 * 24 * 60 * 60 * 1000;
    if (endDateObj - startDateObj > fiveYearsInMs) {
      setDateError("Date range cannot exceed 5 years");
      return false;
    }

    // Check if start date is too far in the past (e.g., more than 10 years)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    if (startDateObj < tenYearsAgo) {
      setDateError("Start date cannot be more than 10 years ago");
      return false;
    }

    return true;
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    validateDates(newStartDate, endDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    validateDates(startDate, newEndDate);
  };

  const fetchData = async (start = startDate, end = endDate) => {
    if (!validateDates(start, end)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const params = { start_date: start, end_date: end };

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
    // Initial data fetch with default dates
    fetchData(startDate, endDate);
    fetchAllStatusCounts();
  }, []); // Empty dependency array for initial load only

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
      fetchAllStatusCounts();
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
        title: "Close",
        value: statusCounts.close,
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
        {/* <IncidentAgingTable /> */}
        {/* {incidentsData && servicesData && (
          <DashboardGraphs
            incidentsData={incidentsData}
            servicesData={servicesData}
            priorities={priorities}
            statuses={statuses}
            departments={departments}
          />
        )} */}
      </Box>
    </Box>
  );
}