import React from 'react';
import PropTypes from 'prop-types';
//import _ from 'lodash';
import auth from '../../../utils/auth';
import axios from 'axios';
import SmartTable from '../../../components/SmartTable/SmartTable';
import UserDetailEditModal from './UserDetailEdit/Modal';
import {EDIT_MODE} from './UserDetailEdit/constants';

class EditableUserTable extends React.PureComponent {
  
  constructor(props) {
    super(props);
    const { dataRow } = this.props;

    this.state = {
      editUser: {
        id: (dataRow && dataRow.id) ? dataRow.id : '',
        fullname: (dataRow && dataRow.fullname) ? dataRow.fullname : '',
        role: (dataRow && dataRow.role) ? dataRow.role : '',
        username: (dataRow && dataRow.login) ? dataRow.login : '',
        password: '',
        repeatPassword: '',
        shops: (dataRow && dataRow.shopsIds) ? dataRow.shopsIds : []
      },
      error: '',
      status: {},
      open: false
    }
  }

  onEditUserSubmit = () => {
    const { editUser } = this.state; 
      // create a string for an HTTP body message

    const userData = {
      id: editUser.id,
      username: editUser.username,
      password: editUser.password,
      fullname: editUser.fullname,
      shops: JSON.stringify(editUser.shops),
      role: editUser.role
    }

    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.post('/staffOnly/editStaffUser', userData, {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response => {        
      if (response.status === 200) {
        this.setState({
          status: {
            message: `Пользователь ${editUser.username} успешно изменен`,
            timestamp: new Date().getTime()
          },
          error: ''
        });

        // if (onSuccess) {
        //   onSuccess();
        // }
        this.onClose();
        this.props.onUserEditted();
      }
      else {
        this.setState({
          error: response.message ? response.message : ''
        });
      }        
    })
    .catch(error => {
      //const errorState = this.state.errors;
      const errorMsg = (error.response && error.response.data && error.response.data.message) ? 
        error.response.data.message : 
        'Проверьте правильность заполнения формы';
      
      this.setState({
        error: errorMsg
      });
    });
  }

  // onClose = () => {
  //   this.setState({
  //     status: {
  //       message: `Пользователь ${this.state.user.username} успешно изменен`,
  //       timestamp: new Date().getTime()
  //     },
  //     error: ''
  //   });
  // }

  handleModalOpen = (dataRow) => {
    //console.log(dataRow);
    this.setState({
      open: true,
      editUser: {
        id: (dataRow && dataRow.id) ? dataRow.id : '',
        fullname: (dataRow && dataRow.fullName) ? dataRow.fullName : '',
        role: (dataRow && dataRow.role) ? dataRow.role : '',
        username: (dataRow && dataRow.login) ? dataRow.login : '',
        password: '',
        repeatPassword: '',
        shops: (dataRow && dataRow.shopsIds) ? dataRow.shopsIds : []
      }
    });
  };

  onClose = () => {
    this.setState({open: false});
  }

  render() {
    const tableHeaders = [
      { id: 'fullName', numeric: false, label: 'ФИО' },
      { id: 'login', numeric: false, label: 'Логин' }, 
      { id: 'role', numeric: false, label: 'Статус' },
      { id: 'shops', numeric: false, label: 'Торговая(ые) точка(и)' },
    ];
    const { users } = this.props;
    const { editUser, error, status, open } = this.state;

    return(
      <div>
        <SmartTable
          columnHeaders={tableHeaders}
          data={users}
          isEditable={true}
          disableToolbar={true}
          handleEdit={this.handleModalOpen}
        />
        <UserDetailEditModal 
          user={editUser}
          error={error}
          status={status}
          onFormSubmit={this.onEditUserSubmit}
          onClose={this.onClose}
          modalHeader="Редактировать пользователя"
          modalSubmitLabel="Редактировать"
          open={open}
          mode={EDIT_MODE}
        />
      </div>
    )
  }
}



EditableUserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  //handleEdit: PropTypes.func.isRequired,
  onUserEditted: PropTypes.func.isRequired
}

export default EditableUserTable;