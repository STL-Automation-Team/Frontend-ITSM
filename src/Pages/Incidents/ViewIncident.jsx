import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import AxiosInstance from '../../Components/AxiosInstance';
// import './ViewIncident.css';

const StatusBadge = ({ status }) => {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'status-badge new';
      case 'ongoing':
        return 'status-badge ongoing';
      case 'on hold':
        return 'status-badge on-hold';
      case 'verified':
        return 'status-badge verified';
      case 'rejected':
        return 'status-badge rejected';
      default:
        return 'status-badge default';
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
      case '1 - high':
        return 'priority-badge high';
      case '3 - moderate':
        return 'priority-badge moderate';
      case '4 - low':
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

const ViewIncident = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
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
    {
      field: 'title',
      headerName: 'Short Description',
      width: 150, // Increase width of the Short Description column
    },
    {
      field: 'contact_display',
      headerName: 'Caller',
      width: 150,
    },
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
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      width: 150,
    },
    {
      field: 'assigned_to_display',
      headerName: 'Assigned To',
      width: 150,
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      width: 100,
    },
    {
      field: 'formattedStartDate',
      headerName: 'Opened',
      width: 100,
    },
    {
      field: 'formattedLastUpdate',
      headerName: 'Updated On',
      width: 180,
    },
  ];

  const fetchIncidents = async () => {
    try {
      const response = await AxiosInstance.get(
        `http://10.100.130.76:3000/api/v1/incidents/incidents_details?skip=${paginationModel.page * paginationModel.pageSize}&limit=${paginationModel.pageSize}`
      );
      const data = response.data;

      const formattedData = data.map((incident) => ({
        ...incident,
        id: incident.id,
        formattedStartDate: incident.start_date ? new Date(incident.start_date).toLocaleString() : '',
        formattedLastUpdate: incident.last_update ? new Date(incident.last_update).toLocaleString() : '',
      }));

      setIncidents(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      setError('Failed to load incident data');
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

  return (
    <Box className="incidents-container">
      <Paper className="incidents-paper">
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
    </Box>
  );
};

export default ViewIncident;