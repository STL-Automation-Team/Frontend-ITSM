import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  IconButton,
  Collapse,
  Tooltip,
  TableHead,
  TableSortLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Add, Remove, FilterList } from "@mui/icons-material";

const headCells = [
  { id: "caller_name", numeric: false, disablePadding: false, label: "Caller Name" },
  { id: "location", numeric: false, disablePadding: false, label: "Location" },
  { id: "category", numeric: false, disablePadding: false, label: "Category" },
  { id: "priority", numeric: false, disablePadding: false, label: "Priority" },
  { id: "title", numeric: false, disablePadding: false, label: "Title" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "sla_status", numeric: false, disablePadding: false, label: "SLA Status" },
];

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
  },
}));

function TableHeadComponent(props) {
  const { order, orderBy, onRequestSort, visibleColumns } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };

  return (
    <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headCells.filter(headCell => visibleColumns.includes(headCell.id)).map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}

function ColumnSelector({ visibleColumns, setVisibleColumns }) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setVisibleColumns(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="column-selector-label">Visible Columns</InputLabel>
      <Select
        labelId="column-selector-label"
        id="column-selector"
        multiple
        value={visibleColumns}
        onChange={handleChange}
        input={<OutlinedInput label="Visible Columns" />}
        renderValue={(selected) => selected.join(', ')}
      >
        {headCells.map((headCell) => (
          <MenuItem key={headCell.id} value={headCell.id}>
            <Checkbox checked={visibleColumns.indexOf(headCell.id) > -1} />
            {headCell.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function IncidentTable() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('caller_name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(headCells.map(cell => cell.id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://10.100.130.76:3000/api/v1/incidents/?skip=${page * rowsPerPage}&limit=${rowsPerPage}`);
        setRows(response.data);
        setTotalRecords(response.data.length); // Adjust this if the API provides a total count
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const renderTableCell = (row, headCell) => {
    if (headCell.id === "priority") {
      return (
        <span className={`priority ${row[headCell.id].toLowerCase()}`}>
          {row[headCell.id]}
        </span>
      );
    } else if (headCell.id === "status") {
      return (
        <span className={`status ${row[headCell.id].toLowerCase()}`}>
          {row[headCell.id]}
        </span>
      );
    } else if (headCell.id === "sla_status") {
      return (
        <span className={`sla-status ${row[headCell.id].toLowerCase().replace(/\s+/g, "-")}`}>
          {row[headCell.id]}
        </span>
      );
    } else if (headCell.id === "title") {
      return (
        <Tooltip title={row[headCell.id]} arrow>
          <span>{row[headCell.id].length > 20 ? `${row[headCell.id].slice(0, 20)}...` : row[headCell.id]}</span>
        </Tooltip>
      );
    } else {
      return <div className={headCell.id}>{row[headCell.id]}</div>;
    }
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <ColumnSelector visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
        </Box>
        <TableContainer sx={{ maxHeight: 670, overflowX: "auto", overflowY: "auto" }}>
          <Table sx={{ minWidth: 750, tableLayout: "fixed", width: `${visibleColumns.length * 194}px` }} aria-labelledby="tableTitle">
            <TableHeadComponent
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              visibleColumns={visibleColumns}
            />
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow hover role="checkbox" tabIndex={-1} sx={{ cursor: "pointer" }}>
                    <TableCell padding="checkbox" sx={{ paddingLeft: "10px" }}>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => toggleRowExpansion(row.id)}
                        className="circle-icon-button"
                      >
                        {expandedRows[row.id] ? (
                          <Remove className="icon" />
                        ) : (
                          <Add className="icon" />
                        )}
                      </IconButton>
                    </TableCell>
                    {headCells.filter(headCell => visibleColumns.includes(headCell.id)).map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align="left"
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                      >
                        {renderTableCell(row, headCell)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={visibleColumns.length + 1}>
                      <Collapse in={expandedRows[row.id]} timeout="auto" unmountOnExit>
                        <Box className="expanded-data-container">
                          <div className="expanded-data-row">
                            <div className="expanded-data-key">Description:</div>
                            <div className="expanded-data-value">{row.description}</div>
                          </div>
                          <div className="expanded-data-row">
                            <div className="expanded-data-key">Attachments:</div>
                            <div className="expanded-data-value">{row.attachments}</div>
                          </div>
                          <div className="expanded-data-row">
                            <div className="expanded-data-key">Department ID:</div>
                            <div className="expanded-data-value">{row.department_id}</div>
                          </div>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default IncidentTable;
