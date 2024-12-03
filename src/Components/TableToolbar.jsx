import {
    Box,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Typography
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import {
    ChevronDown as ChevronDownIcon,
    ChevronUp as ChevronUpIcon,
    Columns as ColumnsIcon,
    Filter as FilterIcon
  } from 'lucide-react';
  import PropTypes from 'prop-types';
  import React, { useEffect, useState } from 'react';
  import "../Styles/TableToolbarStyles.css";
  
  
  const ToolbarButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    padding: '6px 12px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E5E5',
    color: '#1A1A1A',
    '&:hover': {
      backgroundColor: '#F5F5F7',
    }
  }));
  
  const FilterSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .section-title': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    }
  }));
  
  const TableToolbar = ({
    headCells,
    selectedColumns,
    setSelectedColumns,
    statusOptions = [],
    priorityOptions = [],
    categoryOptions = [],
    departmentOptions = [],
  
    selectedStatuses = [],
    setSelectedStatuses,
    selectedPriorities = [],
    setSelectedPriorities,
    selectedCategories = [],
    setSelectedCategories,
    selectedDepartments = [],
    setSelectedDepartments,
  
    startDate = '',
    setStartDate,
    endDate = '',
    setEndDate,
  }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [columnsAnchorEl, setColumnsAnchorEl] = useState(null);
    const [openSections, setOpenSections] = useState({
      status: true,
      priority: true,
      category: true,
      department: true,
    });
    const [dateError, setDateError] = useState({
      start: '',
      end: ''
    });
  
    // Ensure arrays are properly initialized
    useEffect(() => {
      if (!Array.isArray(selectedStatuses)) setSelectedStatuses([]);
      if (!Array.isArray(selectedPriorities)) setSelectedPriorities([]);
      if (!Array.isArray(selectedCategories)) setSelectedCategories([]);
      if (!Array.isArray(selectedDepartments)) setSelectedDepartments([]);
  
    }, []);
  
    // Validate dates whenever they change
    useEffect(() => {
      validateDates(startDate, endDate);
    }, [startDate, endDate]);
  
    const validateDates = (start, end) => {
      const newErrors = {
        start: '',
        end: ''
      };
  
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
  
        if (startDate > endDate) {
          newErrors.end = 'End date must be after start date';
        }
      }
  
      setDateError(newErrors);
    };
  
    const handleFilterClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleColumnsClick = (event) => {
      setColumnsAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
      setColumnsAnchorEl(null);
    };
  
    const toggleSection = (section) => {
      setOpenSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    };
  
  
  
    const handleColumnToggle = (columnId) => {
      const newSelectedColumns = selectedColumns.includes(columnId)
        ? selectedColumns.filter((id) => id !== columnId)
        : [...selectedColumns, columnId];
  
      // Prevent deselecting the last column
      if (newSelectedColumns.length === 0) {
        return;
      }
  
      setSelectedColumns(newSelectedColumns);
    };
  
    const handleStartDateChange = (event) => {
      const newDate = event.target.value;
      setStartDate(newDate);
    };
  
    const handleEndDateChange = (event) => {
      const newDate = event.target.value;
      setEndDate(newDate);
    };
  
    const isItemSelected = (type, value) => {
      const selections = {
        status: selectedStatuses,
        priority: selectedPriorities,
        category: selectedCategories,
        department: selectedDepartments,
      };
      return Array.isArray(selections[type]) && selections[type].includes(value);
    };
  
    const handleFilterSelection = (type, value) => {
      const setters = {
        status: setSelectedStatuses,
        priority: setSelectedPriorities,
        category: setSelectedCategories,
        department: setSelectedDepartments,
      };
  
      const currentSelection = {
        status: selectedStatuses,
        priority: selectedPriorities,
        category: selectedCategories,
        department: selectedDepartments,
      };
  
      const setter = setters[type];
      const current = Array.isArray(currentSelection[type]) ? currentSelection[type] : [];
  
      if (current.includes(value)) {
        setter(current.filter(item => item !== value));
      } else {
        setter([...current, value]);
      }
    };
  
    return (
      <Box sx={{ padding: 2, borderBottom: '1px solid #E5E5E5' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToolbarButton
            startIcon={<ColumnsIcon size={16} />}
            onClick={handleColumnsClick}
          >
            Columns
          </ToolbarButton>
  
          <FormControl error={Boolean(dateError.start)}>
            <TextField
              type="date"
              size="small"
              value={startDate}
              onChange={handleStartDateChange}
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              error={Boolean(dateError.start)}
              helperText={dateError.start}
              sx={{ minWidth: '200px' }}
            />
          </FormControl>
  
          <FormControl error={Boolean(dateError.end)}>
            <TextField
              type="date"
              size="small"
              value={endDate}
              onChange={handleEndDateChange}
              label="End Date"
              InputLabelProps={{ shrink: true }}
              error={Boolean(dateError.end)}
              helperText={dateError.end}
              sx={{ minWidth: '200px' }}
            />
          </FormControl>
  
          <ToolbarButton
            startIcon={<FilterIcon size={16} />}
            onClick={handleFilterClick}
          >
            Filters
          </ToolbarButton>
        </Box>
  
        <Menu
          anchorEl={columnsAnchorEl}
          open={Boolean(columnsAnchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: { maxHeight: 300 }
          }}
        >
          {headCells.map((cell) => (
            <MenuItem
              key={cell.id}
              onClick={() => handleColumnToggle(cell.id)}
              dense
            >
              <Checkbox
                checked={selectedColumns.includes(cell.id)}
                size="small"
              />
              <ListItemText primary={cell.label} />
            </MenuItem>
          ))}
        </Menu>
  
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: { width: 280, maxHeight: 500 }
          }}
        >
          <Box sx={{ p: 2 }}>
            {statusOptions?.length > 0 && (
              <FilterSection>
                <Typography className="section-title" variant="subtitle2">
                  <IconButton size="small" onClick={() => toggleSection('status')}>
                    {openSections.status ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </IconButton>
                  Status
                </Typography>
                <Collapse in={openSections.status}>
                  {statusOptions.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => handleFilterSelection('status', status)}
                      dense
                    >
                      <Checkbox
                        checked={isItemSelected('status', status)}
                        size="small"
                      />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Collapse>
              </FilterSection>
            )}
  
            {priorityOptions?.length > 0 && (
              <FilterSection>
                <Typography className="section-title" variant="subtitle2">
                  <IconButton size="small" onClick={() => toggleSection('priority')}>
                    {openSections.priority ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </IconButton>
                  Priority
                </Typography>
                <Collapse in={openSections.priority}>
                  {priorityOptions.map((priority) => (
                    <MenuItem
                      key={priority}
                      onClick={() => handleFilterSelection('priority', priority)}
                      dense
                    >
                      <Checkbox
                        checked={isItemSelected('priority', priority)}
                        size="small"
                      />
                      <ListItemText primary={priority} />
                    </MenuItem>
                  ))}
                </Collapse>
              </FilterSection>
            )}
  
            {categoryOptions?.length > 0 && (
              <FilterSection>
                <Typography className="section-title" variant="subtitle2">
                  <IconButton size="small" onClick={() => toggleSection('category')}>
                    {openSections.category ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </IconButton>
                  Category
                </Typography>
                <Collapse in={openSections.category}>
                  {categoryOptions.map((category) => (
                    <MenuItem
                      key={category}
                      onClick={() => handleFilterSelection('category', category)}
                      dense
                    >
                      <Checkbox
                        checked={isItemSelected('category', category)}
                        size="small"
                      />
                      <ListItemText primary={category} />
                    </MenuItem>
                  ))}
                </Collapse>
              </FilterSection>
            )}
  
            {departmentOptions?.length > 0 && (
              <FilterSection>
                <Typography className="section-title" variant="subtitle2">
                  <IconButton size="small" onClick={() => toggleSection('department')}>
                    {openSections.department ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                  </IconButton>
                  Department
                </Typography>
                <Collapse in={openSections.department}>
                  {departmentOptions.map((department) => (
                    <MenuItem
                      key={department}
                      onClick={() => handleFilterSelection('department', department)}
                      dense
                    >
                      <Checkbox
                        checked={isItemSelected('department', department)}
                        size="small"
                      />
                      <ListItemText primary={department} />
                    </MenuItem>
                  ))}
                </Collapse>
              </FilterSection>
            )}
  
          </Box>
        </Menu>
      </Box>
    );
  };
  
  TableToolbar.propTypes = {
    headCells: PropTypes.array.isRequired,
    selectedColumns: PropTypes.array.isRequired,
    setSelectedColumns: PropTypes.func.isRequired,
    statusOptions: PropTypes.array,
    priorityOptions: PropTypes.array,
    categoryOptions: PropTypes.array,
    departmentOptions: PropTypes.array,
    selectedStatuses: PropTypes.array,
    setSelectedStatuses: PropTypes.func.isRequired,
    selectedPriorities: PropTypes.array,
    setSelectedPriorities: PropTypes.func.isRequired,
    selectedCategories: PropTypes.array,
    setSelectedCategories: PropTypes.func.isRequired,
    selectedDepartments: PropTypes.array,
    setSelectedDepartments: PropTypes.func.isRequired,
    startDate: PropTypes.string,
    setStartDate: PropTypes.func.isRequired,
    endDate: PropTypes.string,
    setEndDate: PropTypes.func.isRequired
  };
  
  export default TableToolbar;