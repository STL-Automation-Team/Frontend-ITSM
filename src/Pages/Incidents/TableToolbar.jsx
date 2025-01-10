import React from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ListItemText,
  InputLabel,
  Chip,
} from '@mui/material';

const TableToolBar = ({
  columnVisibility,
  headCells,
  onColumnVisibilityChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  statuses,
  selectedStatuses,
  onStatusChange,
}) => {
  const allColumnsSelected = Object.values(columnVisibility).every(v => v);
  const allStatusesSelected = statuses.length === selectedStatuses.length;

  const handleColumnSelectAll = (checked) => {
    const newVisibility = {};
    headCells.forEach(cell => {
      newVisibility[cell.id] = checked;
    });
    onColumnVisibilityChange(newVisibility);
  };

  const handleColumnToggle = (columnId) => {
    const newVisibility = {
      ...columnVisibility,
      [columnId]: !columnVisibility[columnId]
    };
    onColumnVisibilityChange(newVisibility);
  };

  const handleStatusSelectAll = (checked) => {
    onStatusChange(checked ? statuses.map(s => s.id) : []);
  };

  const handleChipDelete = (statusId) => {
    const newSelectedStatuses = selectedStatuses.filter(id => id !== statusId);
    onStatusChange(newSelectedStatuses);
  };

  const renderFilterChips = () => [
    startDate && (
      <Chip
        key="startDate"
        label={`Start Date: ${startDate}`}
        onDelete={() => onStartDateChange('')}
      />
    ),
    endDate && (
      <Chip
        key="endDate"
        label={`End Date: ${endDate}`}
        onDelete={() => onEndDateChange('')}
      />
    ),
    ...selectedStatuses.map((statusId) => {
      const status = statuses.find((s) => s.id === statusId);
      return status ? (
        <Chip
          key={`status-${statusId}`}
          label={`Status: ${status.name}`}
          onDelete={() => handleChipDelete(statusId)}
        />
      ) : null;
    }),
  ].filter(Boolean);

  return (
    <Box sx={{display:'block'}}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel></InputLabel>
          <Select
            multiple
            value={selectedStatuses}
            onChange={(e) => onStatusChange(e.target.value)}
            renderValue={(selected) =>'Status'}
          >
            <MenuItem>
              <Checkbox 
                checked={allStatusesSelected}
                onChange={(e) => handleStatusSelectAll(e.target.checked)}
                indeterminate={selectedStatuses.length > 0 && !allStatusesSelected}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                <Checkbox checked={selectedStatuses.includes(status.id)} />
                <ListItemText primary={status.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Columns</InputLabel>
          <Select
            multiple
            value={[]} // This prevents the select from controlling the checkboxes
            onChange={() => {}} // Empty onChange as we handle changes via checkboxes
            renderValue={() => "Columns"}
          >
            <MenuItem>
              <Checkbox 
                checked={allColumnsSelected}
                onChange={(e) => handleColumnSelectAll(e.target.checked)}
                indeterminate={Object.values(columnVisibility).some(v => v) && !allColumnsSelected}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {headCells.map((cell) => (
              <MenuItem 
                key={cell.id} 
                value={cell.id}
                onClick={(e) => {
                  e.preventDefault(); // Prevent menu from closing
                  handleColumnToggle(cell.id);
                }}
              >
                <Checkbox 
                  checked={columnVisibility[cell.id]}
                  onChange={() => handleColumnToggle(cell.id)}
                />
                <ListItemText primary={cell.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {renderFilterChips()}
      </Box>
    </Box>
  );
};

export default TableToolBar;