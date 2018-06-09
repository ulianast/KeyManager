import React from 'react';
import PropTypes from 'prop-types';
import {
  TableCell,
  TableRow,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {default as ArrowDownIcon} from '@material-ui/icons/Visibility';
import {default as ArrowUpIcon} from '@material-ui/icons/VisibilityOff';
// import {default as EditIcon} from '@material-ui/icons/Create';
import Checkbox from 'material-ui/Checkbox';
import DateTime from '../DateTimeValue';
import {default as EditIcon} from '@material-ui/icons/Create';
//import EditRowModal from './EditRowModal';

//const EditRow = EditRowModal()

class SmartTableDataRow extends React.Component {

  // constructor(props) {
  //   super(props);
    
  //   if (props.isEditable) {
  //     editModal = EditRowModal(props.EditModalNode, props.dataRow);
  //   }
  // }

  // let editModal = null;

	render() {
		const {dataRow, index, isSelected, isSelectable, isExpandable, isExpanded, handleExpand, 
			handleSelect, columnHeaders, isEditable, handleEdit } = this.props;
    //console.log(this.props.EditModalNode);
    //console.log(isEditable);
    

    // if (isEditable) {
    //   const EditModalWrapper = row =>
    //     EditModalNode =>
    //       props => EditModalNode({ 
    //         ...props, 
    //         dataRow: { row } 
    //       });

    //   EditModal = EditModalWrapper({ row: dataRow })(EditModalNode);
    // }

    // let EditModal = null;
    // if (isEditable) {
    //   EditModal = EditRowModal(EditModalNode, dataRow);
    // }

    // //console.log(typeof EditModalNode);
    // console.log(typeof EditModal);
    

		return (
			<TableRow
        hover
        onClick={event => handleSelect(event, dataRow.id)}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        key={dataRow.id}
        selected={isSelected || isExpanded}
      >
        {isSelectable && 
          <TableCell padding="checkbox">
            <Checkbox checked={isSelected} color="primary"/>
          </TableCell>
        }

        <TableCell
          key = "number"
          numeric = {true}
          padding = "checkbox"
        >
          {index}
        </TableCell>

        {isExpandable && 
          <TableCell padding="checkbox">
            <IconButton color="primary" onClick={event => handleExpand(event, dataRow.id)}>
              {!isExpanded && <ArrowDownIcon />}
              {isExpanded && <ArrowUpIcon />}
            </IconButton>
             
          </TableCell>
        }  

        {isEditable && 
          <TableCell padding="checkbox">
            <IconButton color="primary" onClick={() => handleEdit(dataRow)}>
              <EditIcon />
            </IconButton>
          </TableCell>
        }      

        {columnHeaders.map(column => {
          return (
            <TableCell
              key = {column.id}
              numeric = {column.numeric}
              padding = 'dense'
            >
              { 
                column.isDateType ?                 
                  <DateTime val = {dataRow[column.id]}/> :
                  dataRow[column.id]
              }
            </TableCell>
          );
        })}                  
      </TableRow>
			);
	}
}



SmartTableDataRow.propTypes = {
  columnHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  index: PropTypes.number.isRequired,
  dataRow: PropTypes.object.isRequired,
  handleExpand: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  isSelectable: PropTypes.bool.isRequired,
  isExpandable: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool,
  //EditModalNode: PropTypes.element
};

export default SmartTableDataRow;