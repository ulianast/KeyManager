import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import UserDetailForm from './Form';
import auth from '../../../../utils/auth';
import Button from 'material-ui/Button';
import Notifications from '../../../../components/NotificationMessage/Notification';

class UserDetailEditContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: props.errors,
      user: props.user, 
      shops: [], 
      roles: []
    };
  }

  componentDidMount() {
    this.fetchShops();
    this.fetchRoles();
  }

  fetchRoles = () => {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/userRoles', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response => {
      if (response && response.data) {
        const roleOptions = Object.keys(response.data).map(key => {
          const reducedItem = {
            value: key,
            label: response.data[key]
          }
          return reducedItem;
        });

        this.setState({
          roles: roleOptions
        });
      }
    })
    .catch(error => {
      // const errorState = this.state.errors;

      // errorState.summary = error.message;

      // this.setState({
      //   errors: errorState
      // });
    });
  }

  /**
   * Fetch shops from db server
   */
  fetchShops = () => {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/shops', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response =>{
      if (response && response.data && response.data.shops) {
        const shopsOptions = response.data.shops.map(item => {
          const reducedItem = {
            value: item.id,
            label: item.address 
          }
          return reducedItem;
        });

        this.setState({
          shops: shopsOptions
        });
      }
    })
    .catch(error => {
      // const errorState = this.state.errors;

      // errorState.summary = error.message;

      // this.setState({
      //   errors: errorState
      // });
    });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser = (event) => {
    const field = event.target.name;
    const { user, errors } = this.state;
    user[field] = event.target.value;
    errors[field] = '';

    this.setState({
      user, errors
    });
  }

  onShopSelected = (event, index, values) => {
    const user = this.state.user;
    user.shops = event.target.value;
    
    this.setState({user});
  }

  onRoleSelected = (event, index, value) => {
    const user = this.state.user;
    user.role = value;
    this.setState({user});
  }

  checkLoginIfExist = (event) => {
    if ( !this.state.user.username || this.state.user.username === 0) {
      return;
    }

    const token = auth.getToken();
    const authHeader = `JWT ${token}`;
    const username = encodeURIComponent(this.state.user.username);

    axios.get(`/staffOnly/checkLogin/${username}`, {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response => {
      const errorState = this.state.errors;
    
      errorState.username = (response && response.data && response.data.exist) ?
          "Пользователь с таким логином уже существует" :
          "";

      this.setState({
        errors: errorState
      });
    })
    .catch(error => {
      const errorState = this.state.errors;

      errorState.summary = error.message;

      this.setState({
        errors: errorState
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      errors: nextProps.errors,
      user: nextProps.user,
    });
  }

  render() {
    const { shops, roles, user, errors } = this.state;
    const { mode } = this.props;

    return (
      <div>
        <UserDetailForm
          onChange={this.changeUser}
          onLoginInputEnd={this.checkLoginIfExist}
          onShopSelected={this.onShopSelected}
          onRoleSelected={this.onRoleSelected}
          errors={errors}
          user={user}
          shopsOptions={shops}
          roleOptions={roles}
          mode={mode}
        />
      </div>
    );
  }
}



UserDetailEditContainer.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
}

export default UserDetailEditContainer;