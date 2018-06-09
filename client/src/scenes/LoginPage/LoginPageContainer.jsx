import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import ShopSelectForm from './ShopSelectForm';
import auth from '../../utils/auth';
import axios from 'axios';
import _ from 'lodash';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      user: {
        username: '',
        password: '',
        shop: ''
      },
      shopOptions: [],
      shouldSelectShop: false,
      token: '',

    };

    this.processForm = this.processForm.bind(this);
    this.onInputChanged = this.onInputChanged.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    const validationResult = validateLoginForm(this.state.user);

    if (!validationResult || !validationResult.success) {
      this.setState({
        errors: validationResult.errors
      });
    }
    else {
      // create a string for an HTTP body message
      const username = encodeURIComponent(this.state.user.username);
      const password = encodeURIComponent(this.state.user.password);
      //const formData = `username=${username}&password=${password}`;
      const formData = {
        username: username,
        password: password
      }

      axios.post('/auth/login', formData, {timeout: 10000})
      .then(response => {        
        if (response.status === 200) {
          const shouldSelectShop = _.isArray(response.data.shops) && response.data.shops.length > 1;
          const { user } = this.state;          

          if (shouldSelectShop) {
            this.setState({
              errors: {},
              shouldSelectShop: shouldSelectShop,
              token: response.data.token,
              shopOptions: response.data.shops
            })
          }
          else {
            if (_.isArray(response.data.shops) && response.data.shops.length > 0) {
              user.shop = response.data.shops[0];
            }

            this.authenticateUser(response.data.token, user);
          }
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

  onSetShopSubmit = () => {
    const { user, token, errors, shopOptions } = this.state;

    if (user.shop) {
      user.shop = _.find(shopOptions, { 'id': user.shop });
      this.authenticateUser(token, user);
    }
    else {
      errors.shop = 'Пожалуйста выберите торговую точку';
      this.setState({errors});
    }
  }

  authenticateUser = (token, user) => {
    //const { token, user } = this.state;
    const { onUserLogin } = this.props;

    auth.authenticateUser(token, user.username);
    auth.setShop(user.shop);
    onUserLogin(user.username);
    this.props.history.push('/staffOnly');
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  onInputChanged(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        {!this.state.shouldSelectShop  &&
          <LoginForm
            onSubmit={this.processForm}
            onChange={this.onInputChanged}
            errors={this.state.errors}
            user={this.state.user}
          />
        }
        {this.state.shouldSelectShop  &&
          <ShopSelectForm
            onSubmit={this.onSetShopSubmit}
            onChange={this.onInputChanged}
            errors={this.state.errors}
            user={this.state.user}
            shopOptions={this.state.shopOptions}
          />
        }
      </div>
    );
  }

}

/**
 * Validate the login form
 *
 * @param {object} payload - the user object passed from the form
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Пожалуйста введите ваше имя.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Пожалуйста введите ваш пароль.';
  }

  if (!isFormValid) {
    errors.summary = 'Форма содержит ошибки. Проверьте форму.';
  }

  return {
    success: isFormValid,
    errors
  };
}

LoginPage.propTypes = {
  onUserLogin: PropTypes.func.isRequired,
};

export default LoginPage;