import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ClientProfileForm from './ClientProfileForm';

class ClientProfilePage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      userPhone: ''
    };

    this.fetchServices = this.fetchServices.bind(this);
  }
  
  fetchServices(serviceCode) {
    const codeVal = encodeURIComponent(serviceCode);

    axios.get(
      `/activation/fetchServices/${codeVal}`,
      { headers: { "timeout": 10000 }}
    )  
    .then(response => {
      if (response && response.data) {
        this.setState({
          services: response.data.services ? response.data.services : [],
          userPhone: response.data.user ? response.data.user : ''
        })
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    this.fetchServices(this.props.serviceCode);
  }

  render() {
    const { userPhone, services } = this.state;

    return(
      <ClientProfileForm services={services} userPhone={userPhone}/>
    );
  }
}

ClientProfilePage.propTypes = {
  serviceCode: PropTypes.string.isRequired
}

export default ClientProfilePage;