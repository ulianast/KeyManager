import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
// import Chip from 'material-ui/Chip';
//import { withStyles } from 'material-ui/styles';
import { TablePagination } from 'material-ui/Table';
import SmartTable from '../../../components/SmartTable/SmartTable';
// import NewService from '../NewService/NewServiceContainer';
// import GenerateCodeModal from './GenerateCodeModal/GenerateCodeModal';

//import './styles.css';


class NetworkListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 5,
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  
  render() {
    const { data, usersTableHeaders } = this.props;
    const { rowsPerPage, page } = this.state;

    return (
      <div>      
        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, index) => {
          return (
            <ExpansionPanel key={index}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography >{dataRow.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <SmartTable
                  columnHeaders={usersTableHeaders}
                  data={dataRow.users}
                  title="Консультанты"
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}

        <TablePagination
          component="div"
          count={data.length}
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
      </div>

    );
  }
}

NetworkListComponent.propTypes = {
  usersTableHeaders: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default NetworkListComponent;