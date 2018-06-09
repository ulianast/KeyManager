import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';

class SmartTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { columnHeaders, order, orderBy, isSelectable, isExpandable, isEditable } = this.props;

    return (
      <TableHead>
        <TableRow>
          {isSelectable && <TableCell padding = "checkbox"/>}
          
          <TableCell
            key = "number"           
            numeric = {true}
            padding = "checkbox"
          >
            №
          </TableCell>

          {isExpandable && <TableCell padding = "checkbox"/>}
          {isEditable && <TableCell padding = "checkbox"/>}
          
          {columnHeaders.map(column => {
            return (
              <TableCell
                key = {column.id}
                numeric = {column.numeric}
                padding = 'dense'
                sortDirection = {orderBy === column.id ? order : false}
              >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

SmartTableHead.propTypes = {
  columnHeaders: PropTypes.arrayOf(PropTypes.object),
  //numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,  
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  isSelectable: PropTypes.bool,
  isExpandable: PropTypes.bool,
  isEditable: PropTypes.bool
  //rowCount: PropTypes.number.isRequired,
};

export default SmartTableHead;