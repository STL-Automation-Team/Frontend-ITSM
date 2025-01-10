import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Chip,
  InputLabel,
  Checkbox,
  ListItemText,
  Collapse,
} from '@mui/material';
import * as XLSX from 'xlsx';
import AxiosInstance from '../Components/AxiosInstance';
// import './ViewIncident.css';
import TableToolBar from './Incidents/TableToolbar';

const headCells = [
  { id: 'ref_id', label: 'Number',width:'150px' },
  { id: 'title', label: 'Title', width:'150px' },
  { id: 'contact_display', label: 'Caller',width:'150px' },
  { id: 'priority', label: 'Priority',width:'150px' },
  { id: 'status', label: 'Status',width:'150px' },
  { id: 'category', label: 'Category',width:'150px' },
  { id: 'subcategory', label: 'Subcategory', width:'150px' },
  { id: 'assigned_to_display', label: 'Assigned To',width:'150px' },
  { id: 'created_by', label: 'Created By',width:'150px' },
  { id: 'formattedStartDate', label: 'Opened',width:'150px' },
  { id: 'formattedLastUpdate', label: 'Updated On',width:'150px' },
];

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${status?.toLowerCase()}`}>{status}</span>
);

const PriorityBadge = ({ priority }) => (
  <span className={`priority-badge ${priority?.toLowerCase()}`}>{priority}</span>
);

export default function Reports() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('ref_id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState(
    headCells.reduce((acc, cell) => {
      acc[cell.id] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await AxiosInstance.get('http://10.100.130.76:3000/api/v1/statuses');
        setStatuses(response.data || []);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
      }
    };

    fetchStatuses();
  }, []);

  useEffect(() => {
    const defaultEndDate = new Date().toISOString().split('T')[0];
    const defaultStartDate = new Date();
    defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);
    setStartDate(defaultStartDate.toISOString().split('T')[0]);
    setEndDate(defaultEndDate);
  }, []);

  const fetchIncidents = async () => {
    try {
      const queryParams = new URLSearchParams({
        skip: String(page * rowsPerPage),
        limit: String(rowsPerPage),
        view_type: 'detailed',
      });

      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);
      if (selectedStatuses.length) {
        const statusNames = statuses
          .filter(s => selectedStatuses.includes(s.id))
          .map(s => s.name)
          .join(',');
        queryParams.append('status', statusNames);
      }

      const response = await AxiosInstance.get(
        `http://10.100.130.76:3000/api/v1/incidents/incidents_details?${queryParams.toString()}`
      );

      const { data: incidentData, total_records } = response.data;
      setIncidents(
        incidentData.map((incident) => ({
          ...incident,
          formattedStartDate: incident.start_date
            ? new Date(incident.start_date).toLocaleString()
            : '',
          formattedLastUpdate: incident.last_update
            ? new Date(incident.last_update).toLocaleString()
            : '',
        }))
      );
      setTotalRecords(total_records);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    }
  };


  useEffect(() => {
    fetchIncidents();
  }, [page, rowsPerPage, startDate, endDate, selectedStatuses]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event) => {
    // Check if event is an array (direct update from child) or a select event
    const newValue = Array.isArray(event) ? event : event.target.value;
    setSelectedStatuses(newValue);
  };
  


  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(incidents);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Incidents');
    XLSX.writeFile(workbook, `incidents_${new Date().toISOString()}.xlsx`);
  };


  return (
    <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5', width:'95rem' }}>
      
      <Paper sx={{ borderRadius: '8px' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between',m:2 }}>
          <TableToolBar
            columnVisibility={columnVisibility}
            headCells={headCells}
            onColumnVisibilityChange={(event) => {
              const { value, checked } = event.target;
              setColumnVisibility(prev => ({ ...prev, [value]: checked }));
            }}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            statuses={statuses}
            selectedStatuses={selectedStatuses}
            onStatusChange={handleStatusChange}
          />
          
        </Box>
      </Paper>
      <Button 
            variant="contained" 
            width = '100%'
            onClick={handleDownload}
            sx={{
              display: 'flex',
              bgcolor: '#1976d2',
              alignItems: 'right',
            //   justifyContent: 'right',
              marginTop: '10px',
              '&:hover': { bgcolor: '#1565c0' },
              
            }}
          >
            Download
          </Button>

      {/* <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1,
          borderRadius: '8px',
          '& .MuiTable-root': {
            borderCollapse: 'separate',
            borderSpacing: '0',
          },
          height:'70vh',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((cell) => 
                columnVisibility[cell.id] && (
                  <TableCell
                    key={cell.id}
                    sx={{
                      width: cell.width,
                      bgcolor: '#f5f5f5',
                      borderBottom: '2px solid #e0e0e0',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      padding: '12px 16px',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#eeeeee'
                      }
                    }}
                    onClick={() => handleRequestSort(cell.id)}
                  >
                    {cell.label}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((row) => (
              <TableRow 
                key={row.id}
                onClick={() => navigate(`/incidents/${row.id}`)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                {headCells.map((cell) =>
                  columnVisibility[cell.id] && (
                    <TableCell
                      key={cell.id}
                      sx={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #e0e0e0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: cell.width
                      }}
                    >
                      {cell.id === 'status' ? (
                        <StatusBadge status={row[cell.id]} />
                      ) : cell.id === 'priority' ? (
                        <PriorityBadge priority={row[cell.id]} />
                      ) : (
                        row[cell.id]
                      )}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
      {/* <TablePagination
        component={Paper}
        count={totalRecords}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        sx={{
          mt: 2,
          borderRadius: '8px',
          '& .MuiTablePagination-select': {
            marginRight: 2
          }
        }}
      /> */}
    </Box>
  );
}