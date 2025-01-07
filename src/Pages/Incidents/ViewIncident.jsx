import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as XLSX from "xlsx";
import AxiosInstance from "../../Components/AxiosInstance";
import "./ViewIncident.css";

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case "new":
        return "status-badge new";
      case "in-progress":
        return "status-badge in-progress";
      case "on hold":
        return "status-badge on-hold";
      case "verified":
        return "status-badge verified";
      case "resolve":
        return "status-badge resolve";
        case "close":
          return "status-badge close";
      default:
        return "status-badge default";
    }
  };

  return <span className={getStatusStyle()}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const getPriorityStyle = () => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "priority-badge high";
      case "critical":
        return "priority-badge moderate";
      case "low":
        return "priority-badge low";
      default:
        return "priority-badge default";
    }
  };

  return <span className={getPriorityStyle()}>{priority}</span>;
};

const ViewIncident = ({ highlightedRefId }) => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const highlightedRowRef = useRef(null);
  const [error, setError] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const handleIncidentClick = (id) => {
    navigate(`/incidents/${id}`);
  };

  const handleDownload = () => {
    // Use filteredRows if available, otherwise use all incidents
    const dataToDownload = filteredRows.length > 0 ? filteredRows : incidents;
    
    // Convert the filtered incidents into a format suitable for Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incidents");

    // Trigger download
    XLSX.writeFile(workbook, `incidents_${new Date().toISOString()}.xlsx`);
  };


  const columns = [
    {
      field: "ref_id",
      headerName: "Number",
      width: 150,
      renderCell: (params) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleIncidentClick(params.row.id);
          }}
          className="incident-number"
          ref={params.value === highlightedRefId ? highlightedRowRef : null}
        >
          {params.value}
        </a>
      ),
      cellClassName: (params) =>
        params.value === highlightedRefId
          ? "grid-cell-center highlighted"
          : "grid-cell-center",
    },
    {
      field: "title",
      headerName: "Short Description",
      width: 150,
      cellClassName: "grid-cell-center",
    },
    {
      field: "contact_display",
      headerName: "Caller",
      width: 150,
      cellClassName: "grid-cell-center",
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params) => <PriorityBadge priority={params.value} />,
      cellClassName: "grid-cell-center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} />,
      cellClassName: "grid-cell-center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      cellClassName: "grid-cell-center",
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      width: 150,
      cellClassName: "grid-cell-center",
    },
    {
      field: "assigned_to_display",
      headerName: "Assigned To",
      width: 150,
      cellClassName: "grid-cell-center",
    },
    {
      field: "created_by",
      headerName: "Created By",
      width: 100,
      cellClassName: "grid-cell-center",
    },
    {
      field: "formattedStartDate",
      headerName: "Opened",
      width: 100,
      cellClassName: "grid-cell-center",
    },
    {
      field: "formattedLastUpdate",
      headerName: "Updated On",
      width: 180,
      cellClassName: "grid-cell-center",
    },
  ];

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (highlightedRefId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedRefId, incidents]);


  useEffect(() => {
    if (highlightedRefId && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedRefId, incidents]);

  const fetchIncidents = async () => {
    try {
      const response = await AxiosInstance.get(
        `http://10.100.130.76:3000/api/v1/incidents/incidents_details?skip=${
          paginationModel.page * paginationModel.pageSize
        }&limit=${paginationModel.pageSize}`
      );

      const { data: incidentData } = response.data;

      if (Array.isArray(incidentData)) {
        const formattedData = incidentData.map((incident) => ({
          ...incident,
          formattedStartDate: incident.start_date
            ? new Date(incident.start_date).toLocaleString()
            : "",
          formattedLastUpdate: incident.last_update
            ? new Date(incident.last_update).toLocaleString()
            : "",
        }));

        setIncidents(formattedData);
      } else {
        console.error("Unexpected data format:", incidentData);
        setError("Unexpected data format received from API");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setError("Failed to load incident data");
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchIncidents();
  }, [paginationModel.page, paginationModel.pageSize]);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  // console.log("bye",incidents);
  return (
    <Box className="incidents-container">
      <Paper className="incidents-paper">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Incidents
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
        <DataGrid
          rows={incidents}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          disableRowSelectionOnClick
          checkboxSelection={false}
          loading={isLoading}
          className="incidents-grid"
          getRowClassName={(params) =>
            params.row.ref_id === highlightedRefId ? "highlighted-row" : ""
          }
          onFilterModelChange={(model) => {
            // Get the filtered rows using the built-in filtering of DataGrid
            const gridFilterModel = model;
            if (!gridFilterModel.items || gridFilterModel.items.length === 0) {
              setFilteredRows([]); // Reset filtered rows when no filters are applied
              return;
            }

            // Apply filters manually to get filtered rows
            const filtered = incidents.filter((row) => {
              return gridFilterModel.items.every((filterItem) => {
                if (!filterItem.field || !filterItem.operator || !filterItem.value) {
                  return true;
                }

                const cellValue = row[filterItem.field];
                const filterValue = filterItem.value;

                switch (filterItem.operator) {
                  case 'equals':
                    return cellValue?.toString().toLowerCase() === filterValue?.toString().toLowerCase();
                  case 'contains':
                    return cellValue?.toString().toLowerCase().includes(filterValue?.toString().toLowerCase());
                  // Add more operators as needed
                  default:
                    return true;
                }
              });
            });
            setFilteredRows(filtered);
          }}
          sx={{
            border: "none",
            height: "600px",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f1f5f9",
              color: "#475569",
              borderBottom: "1px solid #e2e8f0",
              fontWeight: 700,
            },
            "& .MuiDataGrid-cell": {
              padding: "12px",
              borderBottom: "1px solid #e2e8f0",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f9fafb",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "auto",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default ViewIncident;