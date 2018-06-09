import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import NewServiceModalForm from './NewServiceModalForm';
import auth from '../../../../utils/auth';
import FormData from 'form-data';

class NewServiceContainer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      service: {
        name: '',
        components: [],
        img: null
      },
      errors: {
        name: '',
        components: '',
        img: '',
        summary: ''
      },
      licences: []
    }

    this.onInputChanged = this.onInputChanged.bind(this);
    this.fetchLicences = this.fetchLicences.bind(this);
    this.createService = this.createService.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.onImageSelected = this.onImageSelected.bind(this);
  }

  componentDidMount() {
    this.fetchLicences();
  }

  componentWillUnmount() {
    const {service} = this.state;

    if (service && service.img) {
      window.URL.revokeObjectURL(service.img.preview);
    }
  }

  /**
   * Fetch licences from db server
   */
  fetchLicences() {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/licences', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
      .then(response =>{
        if (response && response.data && response.data.licences) {
          this.setState({
            licences: response.data.licences
          });
        }
      })
      .catch(error => {
        this.setState({
          error: (error.response && error.response.data && error.response.data.error) ? 
            error.response.data.error : 
            'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
        });
      });
  }

  createService(onSuccess, onReject) {
    const { service } = this.state;

    const validationResults = this.validateForm(service);

    if ( !validationResults.success) {
      this.setState({
        errors: validationResults.errors
      });

      return onReject ? onReject() : null;
    }

    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    const formData = new FormData();
    formData.append('name', service.name);
    formData.append('components', service.components);
    formData.append('files', service.img);

    axios.post('/staffOnly/createService', formData, { headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response => {   
      if (response.status === 200) {
        this.setState({
          status : {
            message: "Сервис успешно создан",
            timestamp: new Date().getTime()
          },
          service: {
            name: '',
            components: [],
            img: null
          },
          errors: {
            name: '',
            components: '',
            img: '',
            summary: ''
          }
        });

        this.props.onServiceAdded();

        if (onSuccess) {
          onSuccess();
        }
      }
      //all responses with 400 staus codes automatically go to catch section according to axios implementation       
    })
    .catch(error => {
      this.setState({
        error: (error.response && error.response.data && error.response.data.error) ? 
          error.response.data.error : 
          'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
      });

      return onReject ? onReject() : null;
    });
  }

  cleanData = () => {
    this.setState({
      service: {
        name: '',
        components: [],
        img: null
      },
      errors: {
        name: '',
        components: '',
        img: '',
        summary: ''
      },
    });
  }

  validateForm(payload) {

    const errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Пожалуйста введите название сервиса';
    }

    if (!payload || !payload.components || !payload.components.length  || payload.components.length === 0) {
      isFormValid = false;
      errors.components = 'Пожалуйста выберите лицензии';
    }

    if (!payload || !payload.img ) {
      isFormValid = false;
      errors.img = 'Пожалуйста выберите изображение';
    }

    if (!isFormValid) {
      errors.summary = 'Форма содержит ошибки. Проверьте форму';
    }

    return {
      success: isFormValid,
      errors: errors
    };
  }

  /**
   * Change the service object.
   *
   * @param {object} event - the JavaScript event object
   */
  onInputChanged(event) {
    const field = event.target.name;
    const service = this.state.service;
    service[field] = event.target.value;

    this.setState({
      service
    });
  }

  onImageSelected(img) {
    const {errors, service} = this.state;
    
    if (img && img.length === 1) {
      service.img = img[0];
      this.setState({service: service});
    }
  }

  render() {
    return(
      <NewServiceModalForm
        onImageSelected={this.onImageSelected}
        onChange={this.onInputChanged}
        onFormSubmit={this.createService}
        onClose={this.cleanData}
        service={this.state.service}
        errors={this.state.errors}
        licences={this.state.licences}
        status={this.state.status}
      />
    );
  }
}

NewServiceContainer.propTypes = {
  onServiceAdded: PropTypes.func.isRequired
}

export default NewServiceContainer;