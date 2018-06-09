import React from 'react';
// import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import SmartTableHead from './SmartTableHead';
import SmartTableToolbar from './SmartTableToolbar';
import SmartTableDataRow from './SmartTableDataRow';
import SmartTableFilterRow from './SmartTableFilterRow';
import Collapse from 'material-ui/transitions/Collapse';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import './styles.css';

class SmartTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: props.columnHeaders[0].id,
      selected: props.selected,
      expanded: [],
      data: props.data,
      filteredData: _.clone(props.data),
      page: 0,
      rowsPerPage: 5,
      filters: []
    };

    this.isSelected = this.isSelected.bind(this);
    this.isExpanded = this.isExpanded.bind(this);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleChangeFilter = this.handleChangeFilter.bind(this);
  }

  handleChangeFilter(filters) {    
    this.setState({
      filteredData: this.filterData(this.state.data, filters), 
      filters: filters
    });
  }

  filterData(data, filters) {
    const filteredData = [];

    _.forEach(data, dataRow => {
      let match = true;

      _.forEach(filters, filter => {
        match = match && filter.val === dataRow[filter.columnId];
      });

      if (match) {
        filteredData.push(dataRow);
      }
    });

    return filteredData;
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const filteredData =
      order === 'desc'
        ? this.state.filteredData.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.filteredData.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ filteredData, order, orderBy });
  };

  
  handleClick = (event, id) => {
    if (this.props.isSelectable && this.props.selected) {
      const selectedIndex = _.indexOf(this.props.selected, id);

      if (selectedIndex === -1) {
        this.props.selected.push(id);
      } 
      else {
        _.pull(this.props.selected, id);
      }

      this.setState({ selected: this.props.selected });
    }
  };

  handleExpand = (event, id) => {
    if (this.props.isExpandable) {
      const expIndex = _.indexOf(this.state.expanded, id);
      const {expanded} = this.state;

      if (expIndex === -1) {
        expanded.push(id);
      } 
      else {
        _.pull(expanded, id);
      }

      this.setState({ expanded: expanded });
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => {
    return this.props.selected != undefined && this.props.selected.length > 0 && this.props.selected.indexOf(id) !== -1;
  };

  isExpanded = id => {
    return this.state.expanded && this.state.expanded.indexOf(id) !== -1
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      filteredData: this.filterData(nextProps.data)
    });
  }

  render() {
    const { columnHeaders, title, isSelectable, isExpandable, selected, disableToolbar, 
      disableFootbar, inlineTableHeaders, inlineTableDataName, isFilterable, isEditable, 
      handleEdit } = this.props;
    const { filteredData, order, orderBy, rowsPerPage, page } = this.state;

    return (
      <Paper className="table-width-full">
        {!disableToolbar && <SmartTableToolbar numSelected={selected ? selected.length : 0} title={title}/>}
        <div>
          <Table>
            <SmartTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnHeaders={columnHeaders}
              isSelectable={isSelectable}
              isExpandable={isExpandable}
              isEditable={isEditable}
            />
            <TableBody>
              {isFilterable && 
                <SmartTableFilterRow 
                  key='filtersRow'
                  columnHeaders={columnHeaders}
                  data={filteredData}
                  isSelectable={isSelectable}
                  isExpandable={isExpandable}
                  isEditable={isEditable}
                  onFilterChanged={this.handleChangeFilter}
                />
              }

              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, index) => {
                const isSelected = this.isSelected(dataRow.id);
                const isExpanded = this.isExpanded(dataRow.id);

                const rowComponents = [];
                const mainDataRow = (<SmartTableDataRow
                    columnHeaders={columnHeaders}
                    index={index + 1}
                    dataRow={dataRow}
                    //EditModalNode={EditModalNode}
                    handleExpand={this.handleExpand}
                    handleSelect={this.handleClick}
                    handleEdit={handleEdit}
                    //handleEdit={onRowEdit ? onRowEdit : () => {}}
                    isSelectable={isSelectable ? isSelectable : false}
                    isExpandable={isExpandable ? isExpandable : false}
                    isEditable={isEditable}
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    key={index}
                  />);    
                rowComponents.push(mainDataRow);

                if (isExpanded) {
                  const colSpanCount = columnHeaders.length + 1 +
                    (isExpandable ? 1 : 0) + 
                    (isSelectable ? 1 : 0);

                  const detailsDataRow = (
                    <TableRow key={'inline' + index} selected={isSelected} hover>
                    <TableCell colSpan={colSpanCount} className="inline-table no-padding" styles="padding-right: 0px;">
                      <SmartTable
                        columnHeaders={inlineTableHeaders}
                        data={dataRow[inlineTableDataName]}
                        title=""
                        disableFootbar={true}
                        disableToolbar={true} 
                      />
                    </TableCell>
                  </TableRow>);

                  rowComponents.push(detailsDataRow);
                }

                return (rowComponents);
              })}
            </TableBody>
          </Table>
        </div>

        {!disableFootbar && 
          <TablePagination
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Предыдущая страница',
            }}
            nextIconButtonProps={{
              'aria-label': 'Следующая страница',
            }}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
            labelRowsPerPage="Записей на странице:"
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        }
      </Paper>
    );
  }
}

SmartTable.propTypes = {
  columnHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.arrayOf(PropTypes.number),
  isSelectable: PropTypes.bool,
  isExpandable: PropTypes.bool,
  isFilterable: PropTypes.bool,
  isEditable: PropTypes.bool,
  disableToolbar: PropTypes.bool,
  disableFootbar: PropTypes.bool,
  inlineTableHeaders: PropTypes.arrayOf(PropTypes.object),
  inlineTableDataName: PropTypes.string,
  handleEdit: PropTypes.func
};

export default SmartTable;