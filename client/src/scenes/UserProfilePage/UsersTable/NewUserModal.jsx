import React from 'react';
import PropTypes from 'prop-types';
import UserDetailEditModal from './UserDetailEdit/Modal'
import axios from 'axios';
import Button from 'material-ui/Button';
import auth from '../../../utils/auth';
import {CREATE_MODE} from './UserDetailEdit/constants';

class NewUserModal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      user: {
        fullname: '',
        role: '',
        username: '',
        password: '',
        repeatPassword: '',
        shops: []
      },
      error: '',
      status: {},
      open: false
    }
  }

  handleModalOpen = () => {
    this.setState({open: true});
  };

  onCreateNewUserSubmit = () => {
    const userData = {
      username: this.state.user.username,
      password: this.state.user.password,
      fullname: this.state.user.fullname,
      shops: JSON.stringify(this.state.user.shops),
      role: this.state.user.role
    }

    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.post('/staffOnly/newStaffUser', userData, {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response => {        
      if (response.status === 200) {
        const state = this.getInitialState();
        state.status = {
          message: `Пользователь ${this.state.user.username} успешно создан`,
          timestamp: new Date().getTime()
        };

        this.setState(state);          
        this.props.onNewUserAdded();
      }
      else {
        this.setState({
          error: response.message ? response.message : ''
        });
      }        
    })
    .catch(error => {
      const errorMsg = (error.response && error.response.data && error.response.data.message) ? 
        error.response.data.message : 
        'Проверьте правильность заполнения формы';
      
      this.setState({
        error: errorMsg
      });
    });
  }

  onClose = () => {
    this.setState(this.getInitialState());
  }

  render() {
    const { user, error, status, open } = this.state;

    return(
      <div>
        <Button variant="raised" onClick={this.handleModalOpen} color="primary">
          Создать пользователя
        </Button>
        <UserDetailEditModal 
          user={user}
          error={error}
          status={status}
          onFormSubmit={this.onCreateNewUserSubmit}
          onClose={this.onClose}
          modalHeader="Создание нового пользователя"
          modalSubmitLabel="Создать"
          open={open}
          mode={CREATE_MODE}
        />
      </div>
    )
  }
}

NewUserModal.propTypes = {
  onNewUserAdded: PropTypes.func.isRequired
}

export default NewUserModal;