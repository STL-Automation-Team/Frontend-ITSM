import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import AxiosInstance from '../../Components/AxiosInstance';
import './ViewIncident.css';

// Reusing StatusBadge and PriorityBadge from ViewIncident
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

    return (
        <span className={getStatusStyle()}>
          {status}
        </span>
      );
    };

    const PriorityBadge = ({ priority }) => {
        const getPriorityStyle = () => {
          switch (priority?.toLowerCase()) {
            case 'high':
              return 'priority-badge high';
            case 'critical':
              return 'priority-badge moderate';
            case 'low':
              return 'priority-badge low';
            default:
              return 'priority-badge default';
          }
        };

        return (
            <span className={getPriorityStyle()}>
              {priority}
            </span>
          );
        };

const MyAssignedIncidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false); // New state for no data
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });

  const handleIncidentClick = (id) => {
    navigate(`/incidents/${id}`);
  };

  const columns = [
    {
      field: 'ref_id',
      headerName: 'Number',
      width: 150,
      renderCell: (params) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleIncidentClick(params.row.id);
          }}
          className="incident-number"
        >
          {params.value}
        </a>
      ),
    },
    { field: 'title', headerName: 'Short Description', width: 150 },
    { field: 'contact_display', headerName: 'Caller', width: 150 },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => <PriorityBadge priority={params.value} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'subcategory', headerName: 'Subcategory', width: 150 },
    { field: 'assigned_to_display', headerName: 'Assigned To', width: 150 },
    { field: 'created_by', headerName: 'Created By', width: 100 },
    { field: 'formattedStartDate', headerName: 'Opened', width: 100 },
    { field: 'formattedLastUpdate', headerName: 'Updated On', width: 180 },
  ];

  const fetchMyAssignedIncidents = async () => {
    try {
      const contactId = localStorage.getItem('contact_id');
      if (!contactId) {
        throw new Error('Contact ID not found in local storage');
      }
  
      const usersResponse = await AxiosInstance.get(
        'http://10.100.130.76:3000/user/?skip=0&limit=10'
      );
  
      const currentUser = usersResponse.data.find(
        (user) => user.contact_id === parseInt(contactId)
      );

      console.log(currentUser.id);
  
      if (!currentUser) {
        throw new Error('User not found for the given contact ID');
      }
  
      const incidentsResponse = await AxiosInstance.get(
        `http://10.100.130.76:3000/api/v1/incidents/incidents_details?skip=${paginationModel.page * paginationModel.pageSize}&limit=${paginationModel.pageSize}&assigned_to=${currentUser.id}`
      );
  
      if (incidentsResponse.data.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
        const formattedData = incidentsResponse.data.map((incident) => ({
          ...incident,
          id: incident.id,
          formattedStartDate: incident.start_date
            ? new Date(incident.start_date).toLocaleString()
            : '',
          formattedLastUpdate: incident.last_update
            ? new Date(incident.last_update).toLocaleString()
            : '',
        }));
        setIncidents(formattedData);
      }
      setIsLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 error with custom message
        setError(error.response.data.detail || 'No incidents found');
      } else {
        // Handle other errors
        setError(error.message || 'Failed to load incident data');
      }
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchMyAssignedIncidents();
  }, [paginationModel.page, paginationModel.pageSize]);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {/* <AlertTitle>Error</AlertTitle> */}
        {error}
      </Alert>
    );
  }

  return (
    <Box>
        <h2 style={{ margin: "0 0 16px 0", color: 'Black' }}>Assigned Incidents</h2>
    <Box className="my-assigned-incidents-container">
      {/* <h3 style={{ margin: '16px 0', color: 'Black' }}>My Assigned Incidents</h3> */}
      {noData ? (
        <Alert Warning="info" sx={{ mb: 2 }}>
          <AlertTitle>Info</AlertTitle>
          No incidents found for the current user.
        </Alert>
      ) : (
        <Paper className="my-assigned-incidents-paper">
          <DataGrid
            rows={incidents}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            disableRowSelectionOnClick
            checkboxSelection={false}
            loading={isLoading}
            className="my-assigned-incidents-grid"
            sx={{
              border: 'none',
              overflow: 'auto',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f1f5f9',
                color: '#475569',
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 700,
              },
              '& .MuiDataGrid-cell': {
                padding: '12px',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9fafb',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: 'auto',
              },
            }}
          />
        </Paper>
      )}
    </Box>
    </Box>
  );
};

export default MyAssignedIncidents;
