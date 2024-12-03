import Checkbox from '@mui/material/Checkbox'; // Added import for Checkbox
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import PropTypes from 'prop-types';
import React from 'react';

const StyledTableCell = styled(TableCell)(({ theme, isNarrow }) => ({
  backgroundColor: 'lightgray',
  fontSize: '15px',
  fontWeight: 'bold',
  ...(isNarrow && {
    width: '30px',
    padding: '6px',
  }),
}));

const TableHeadComponent = ({
  headCells,
  order,
  orderBy,
  onRequestSort,
  onSelectAllClick, // Added to props
  showCheckbox,
  numSelected,
  rowCount,
  narrowFirstColumn = false,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {!showCheckbox && (
          <StyledTableCell padding="checkbox" style={{ width: 48 }} />
        )}

        {showCheckbox && (
          <StyledTableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all'
              }}
            />
          </StyledTableCell>
        )}

        {headCells.map((headCell, index) => (
          <StyledTableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            align="left"
            sx={{ paddingTop: '9px', paddingBottom: '9px' }}
            isNarrow={narrowFirstColumn && index === 0}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

TableHeadComponent.propTypes = {
  headCells: PropTypes.array.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func, // Added to propTypes
  showCheckbox: PropTypes.bool,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  narrowFirstColumn: PropTypes.bool,
};

export default TableHeadComponent;