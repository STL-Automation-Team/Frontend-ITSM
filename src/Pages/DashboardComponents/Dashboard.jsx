import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import DashboardCards from "./DashboardCards";
import DashboardGraphs from "./DashboardGraphs";

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

export default function Dashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [incidentsData, setIncidentsData] = useState(null);
  const [servicesData, setServicesData] = useState(null);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const fetchReferenceData = async () => {
    try {
      const [prioritiesRes, statusesRes, departmentsRes] = await Promise.all([
        fetch("http://10.100.130.76:3000/api/v1/priority"),
        fetch("http://10.100.130.76:3000/api/v1/statuses"),
        fetch("http://10.100.130.76:3000/departments"),
      ]);

      const [prioritiesData, statusesData, departmentsData] = await Promise.all(
        [prioritiesRes.json(), statusesRes.json(), departmentsRes.json()]
      );

      setPriorities(prioritiesData);
      setStatuses(statusesData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  const fetchData = async (start, end) => {
    try {
      const dateParams =
        start && end ? `?start_date=${start}&end_date=${end}` : "";

      const [incidentsRes, servicesRes] = await Promise.all([
        fetch(
          `http://10.100.130.76:3000/api/v1/incidents-dashboard${dateParams}`
        ),
        fetch(
          `http://10.100.130.76:3000/api/v1/service-request-dashboard${dateParams}`
        ),
      ]);

      const [incidentsData, servicesData] = await Promise.all([
        incidentsRes.json(),
        servicesRes.json(),
      ]);

      setIncidentsData(incidentsData);
      setServicesData(servicesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchReferenceData();
    fetchData();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    } else {
      alert("Please select both start and end dates");
    }
  };

  return (
    <Box sx={{ padding: "0.5rem 0" }}>
      <Typography sx={{marginBottom:'10px', color: 'white', fontWeight:'bold', fontSize:'20px'}}>Dashboard</Typography>
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
  
      {incidentsData && servicesData && (
        <Box sx={{ '& > *': { mb: 2 } }}>
          <DashboardCards
            incidentsData={incidentsData}
            servicesData={servicesData}
          />
          <DashboardGraphs
            incidentsData={incidentsData}
            servicesData={servicesData}
            priorities={priorities}
            statuses={statuses}
            departments={departments}
          />
        </Box>
      )}
    </Box>
  );
}