import React from 'react';
import axios from 'axios';
import UserDetailForm from './UserDetailForm';
import auth from '../../../utils/auth';
import TabHeader from '../../../components/TabHeader/TabHeader';
import Authorization from '../../../components/Authorization';


class NewUserContainer extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      statusMessage: {},
      user: {
        fullname: '',
        role: '',
        username: '',
        password: '',
        repeatPassword: '',
        shops: []
      },
      shops: [], 
      roles: []
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.checkLoginIfExist = this.checkLoginIfExist.bind(this);
    this.fetchShops = this.fetchShops.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.onShopSelected = this.onShopSelected.bind(this);
    this.onRoleSelected = this.onRoleSelected.bind(this);
  }

  componentDidMount() {
    this.fetchShops();
    this.fetchRoles();
  }

  fetchRoles() {
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
        const errorState = this.state.errors;

        errorState.summary = error.message;

        this.setState({
          errors: errorState
        });
      });
  }

  /**
   * Fetch shops from db server
   */
  fetchShops() {
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
        const errorState = this.state.errors;

        errorState.summary = error.message;

        this.setState({
          errors: errorState
        });
      });
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    const errors = this.state.errors;
    errors[field] = '';

    this.setState({
      user, errors
    });
  }

  onShopSelected(event, index, values) {
    const user = this.state.user;
    user.shops = event.target.value;
    
    this.setState({user: user});
  }

  onRoleSelected(event, index, value) {
    const user = this.state.user;
    user.role = value;
    this.setState({user: user});
  }

  checkLoginIfExist(event) {
    if(! this.state.user.username || this.state.user.username === 0) {
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

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const validationResult = validateSignupForm(this.state.user);
    console.log(validationResult);

    if (validationResult && !validationResult.success) {
      this.setState({
        errors: validationResult.errors
      });
    }
    else {
      // create a string for an HTTP body message
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
          this.setState({
            errors: {},
            statusMessage: {
              message: `Пользователь ${this.state.user.username} успешно создан`,
              timestamp: new Date().getTime()
            },
            user: {
              fullname: '',
              role: '',
              username: '',
              password: '',
              repeatPassword: '',
              shops: []
            }
          });
        }
        else {
          const errorState = this.state.errors;
          errorState.summary = response.message ? response.message : '';

          this.setState({
            errors: errorState
          });
        }        
      })
      .catch(error => {
        const errorState = this.state.errors;
        errorState.summary = (error.response && error.response.data && error.response.data.message) ? 
          error.response.data.message : 
          'Проверьте правильность заполнения формы';
        
        this.setState({
          errors: errorState
        });
      });
    }
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        <TabHeader tabText="Создание нового пользователя" />
        <UserDetailForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          onLoginInputEnd={this.checkLoginIfExist}
          onShopSelected={this.onShopSelected}
          onRoleSelected={this.onRoleSelected}
          errors={this.state.errors}
          statusMessage={this.state.statusMessage}
          user={this.state.user}
          shopsOptions={this.state.shops}
          roleOptions={this.state.roles}
        />
      </div>
    );
  }

}

/**
 * Validate the sign up form
 *
 * @param {object} payload - the user object passed from the form
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;

  if (payload) {
    if (typeof payload.password !== 'string' || payload.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Пароль должен содержать минимум 8 символов';
    }

    if (typeof payload.repeatPassword !== 'string' || payload.repeatPassword !== payload.password) {
      isFormValid = false;
      errors.repeatPassword = 'Пароли не совпадают';
    }

    if (typeof payload.username !== 'string' || payload.username.trim().length === 0) {
      isFormValid = false;
      errors.username = 'Пожалуйста введите логин';
    }

    if (typeof payload.fullname !== 'string' || payload.fullname.trim().length === 0) {
      isFormValid = false;
      errors.fullname = 'Пожалуйста введите ФИО';
    }

    if (typeof payload.role !== 'string' || payload.role.trim().length === 0) {
      isFormValid = false;
      errors.role = 'Пожалуйста введите роль';
    }

    if (!payload.shops || !payload.shops.length  || payload.shops.length === 0) {
      if (payload.role !== 'vendor') {
        isFormValid = false;
        errors.shops = 'Пожалуйста выберите торговую точку';
      }
    }

    if (payload.shops && payload.shops.length > 1 && payload.role === 'admin') {
      isFormValid = false;
      errors.shops = 'Для пользователя с ролью "Администратор сети" должна быть выбрана лишь одна сеть';
    }
  }
  else {
    isFormValid = false;
  }

  if (!isFormValid) {
    errors.summary = 'В форме регистрации есть ошибки. Проверьте правильность заполнения.';
  }

  return {
    success: isFormValid,
    errors
  };
}

export default Authorization(NewUserContainer, ['super_admin']);