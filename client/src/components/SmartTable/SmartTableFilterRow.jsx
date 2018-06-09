import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  TableCell,
  TableRow,
} from 'material-ui/Table';
import FilterCell from './FilterCell';


class SmartTableFilterRow extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      columns: this.buildColumnsData(props.columnHeaders),
      filters: []
    }

    this.onFiltersChange = this.onFiltersChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: this.buildColumnsData(nextProps.columnHeaders, nextProps.data,)
    });
  }

  buildColumnsData(columnsHeaders, data) {
    return columnsHeaders.map(column => {
      return {
        isFilterEnabled: column.isFilterEnabled,
        id: column.id,
        data: data,
      };
    });
  }

  onFiltersChange(columnId, val) {
    const {filters} = this.state;

    _.pullAllWith(filters, [{ 'columnId':columnId}], (item, pullPattern) => {
        return item.columnId === pullPattern.columnId;
    });

    if (val) {
      filters.push({
        'columnId': columnId,
        'val': val
      });
    }

    this.setState({
      filters: filters
    });

    this.props.onFilterChanged(filters);
  }

	render() {
		const {columnHeaders, data, isSelectable, isExpandable, isEditable} = this.props;
    const {columns} = this.state;

		return (
			<TableRow tabIndex={-1} key="filterRow">
        {isSelectable && <TableCell padding="checkbox"/>}
        <TableCell padding="checkbox"/>
        {isExpandable && <TableCell padding="checkbox"/>}   
        {isEditable && <TableCell padding="checkbox"/>}    

        {columns.map((column, index) => {
          return (
            <TableCell
              key = {index}
              numeric = {false}
              padding = 'dense'
            >
              { 
                column.isFilterEnabled ?                 
                  <FilterCell data={column.data} columnId={column.id} onSelect={this.onFiltersChange}/>:
                  ''
              }
            </TableCell>
          );
        })}                  
      </TableRow>
			);
	}
}

SmartTableFilterRow.propTypes = {
  columnHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isSelectable: PropTypes.bool,
  isExpandable: PropTypes.bool,
  isEditable: PropTypes.bool,
  onFilterChanged: PropTypes.func.isRequired
};

export default SmartTableFilterRow;