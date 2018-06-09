import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ServicesListComponent from './ServicesListComponent';
import auth from '../../../../utils/auth';

class ServiceListContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      services: props.services,
      // filteredServices: [],
      error: '',
      fileURL: ''
    }

    //this.fetchServices = this.fetchServices.bind(this);
    this.onServiceChosen = this.onServiceChosen.bind(this);
    //this.onSearchChanged = this.onSearchChanged.bind(this);
    this.onGeneratePdf = this.onGeneratePdf.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      services: nextProps.services
    })
  }

  onServiceChosen(event, serviceId) {
    const token = auth.getToken();
    const currentShop = auth.getShop();
    const shopId = (currentShop && currentShop.id) ? currentShop.id : '';
    const authHeader = `JWT ${token}`;

    axios.get(`/staffOnly/generateServiceCode/${serviceId}/${shopId}`, {headers: {
      "timeout": 10000, 
      "Authorization": authHeader
    }})
    .then(response => {
      const code = response.data.code;
      const service = _.find(this.state.services, (item) => { return item.id === serviceId; }); 
      service.code = code;
      this.setState({
        services: this.state.services
      });
      // //Create a Blob from the PDF Stream
      // const file = new Blob(
      //   [response.data], 
      //   {type: 'application/pdf'});
      // //Build a URL from the file
      // this.setState({
      //   fileURL :URL.createObjectURL(file)
      // })
      // //const fileURL = URL.createObjectURL(file);
      // //Open the URL on new Window
      // //window.open(fileURL);
    })
    .catch(error => {
      this.setState({
        error: (error.response && error.response.data && error.response.data.error) ? 
          error.response.data.error : 
          'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
      });
    });
  }

  onGeneratePdf() {

  }

  onModalClose(serviceId) {
    console.log(serviceId);
    const service = _.find(this.state.services, (item) => { return item.id === serviceId; }); 
    service.code = '';
     console.log(service.code);
    this.setState({
      services: this.state.services
    });
  }

  // onServiceChosen(event, serviceId) {
  //   console.log(serviceId);

  //   const token = auth.getToken();
  //   const authHeader = `JWT ${token}`;

  //   axios.get('/staffOnly/pdf/T993-W94P-3XJH-3UWR', {headers: {
  //     "timeout": 10000, 
  //     "Authorization": authHeader,
  //     "responseType": 'blob' //Force to receive data in a Blob Format
  //   }})
  //   .then(response =>{
  //     //Create a Blob from the PDF Stream
  //     const file = new Blob(
  //       [response.data], 
  //       {type: 'application/pdf'});
  //     //Build a URL from the file
  //     this.setState({
  //       fileURL :URL.createObjectURL(file)
  //     })
  //     //const fileURL = URL.createObjectURL(file);
  //     //Open the URL on new Window
  //     //window.open(fileURL);
  //   })
  //   .catch(error => {
  //     this.setState({
  //       error: (error.response && error.response.data && error.response.data.error) ? 
  //         error.response.data.error : 
  //         'Неизвестная ошибка. Пожалуйста обратитесь в поддержку.'
  //     });
  //   });
  // }

  render() {
    const {services, fileURL} = this.state;

    return (
      <ServicesListComponent
        data={services}
        onPanelSubmit={this.onServiceChosen}
        pdf={fileURL}
        onGeneratePdf={this.onGeneratePdf}
        closeModal={this.onModalClose}
      />
    );
  }

}

ServiceListContainer.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default ServiceListContainer;