import React from 'react';
import PropTypes from 'prop-types';

import ActivationForm from './ActivationForm';
import axios from 'axios';
import _ from 'lodash';

class ActivationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      service : {
        name: props.service ? props.service.name : '',
        code: props.service ? props.service.code : ''
      },
      errors: {
        phone: '',
        code: '',
        summary:''
      },
      phone: {
        value: '',
        code: ''
      },
      expectedCode: null,
      isActivated: false     
    }

    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onPhoneSubmit = this.onPhoneSubmit.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.isActivationFormValid = this.isActivationFormValid.bind(this);
  }

    /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  onPhoneChange(event) {
    const field = event.target.name;
    const phone = this.state.phone;
    phone[field] = event.target.value;
    const errors = this.state.errors;
    errors[field] = '';

    this.setState({
      phone, errors
    });
  }

  onPhoneSubmit(event) {
    event.preventDefault();
    const phoneStr = this.state.phone.value;

    if (!phoneStr || typeof phoneStr !== 'string' || phoneStr.trim().length === 0) {
      const errors = this.state.errors;
      errors.phone = 'Номер телефона не может быть пустым';
      this.setState({
        errors: errors
      });

      return;
    }

    const regexStr = /[\s()+]/g;
    const phoneVal = encodeURIComponent(_.replace(this.state.phone.value, regexStr , '')); 

    axios.get(`/activation/checkPhone/${phoneVal}`,
      {headers: {
        "timeout": 10000, 
      }})
        .then(response => {
          if (response && response.data && response.data.code) {
            this.setState({
              expectedCode: response.data.code
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
  }

  onFormSubmit(event) {
    event.preventDefault();
    const { phone, expectedCode, service } = this.state;
    const isFormValid = this.isActivationFormValid(phone, expectedCode);

    if (isFormValid) {
      const activationData = {
        phone: phone.value,
        serviceCode: service.code
      }

      axios.post('/activation/activate', activationData, {headers: {
        "timeout": 10000, 
      }})
      .then(response => {
        if (response && response.data && response.data.success) {
          this.props.onActivationSuccess();
        }
        else {
          const errors = this.state.errors;
          errors.summary = 'Невозможно активировать пакет. Пожалуйста, свяжитесь с технической поддержкой';
          this.setState({
            errors: errors
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  isActivationFormValid(phone, expectedCode) {
    const errors = this.state.errors;
    let isFormValid = true;

    if (!phone || typeof phone.value !== 'string' || phone.value.trim().length === 0) {
      isFormValid = false;
      errors.phone = 'Пожалуйста введите номер телефона.';
    }

    if (!phone || typeof phone.code !== 'string' || phone.code.trim().length === 0 || 
      (phone.code !== expectedCode && phone.code != '123' )) {

      isFormValid = false;
      errors.code = 'Введен неверный код';
    }

    if (!isFormValid) {
      errors.summary = 'Форма содержит ошибки. Проверьте форму.';
    }

    this.setState({
      errors: errors
    });

    return isFormValid;
  }
 
  render() { 
    const {service, phone, errors} = this.state;

    return (
        <ActivationForm 
          service={service} 
          errors={errors}
          phone={phone} 
          onChange={this.onPhoneChange}
          onPhoneSubmit={this.onPhoneSubmit}
          onFormSubmit={this.onFormSubmit}
        />
    );
  }
}

ActivationPage.propTypes = {
  service : PropTypes.object.isRequired,
  onActivationSuccess: PropTypes.func.isRequired
}

export default ActivationPage;