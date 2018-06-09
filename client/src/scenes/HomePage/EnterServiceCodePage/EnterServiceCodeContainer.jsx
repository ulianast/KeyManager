import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import EnterServiceCodeForm from './EnterServiceCodeForm';

class EnterServiceCodeContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ''
    };

    this.onServiceCodeEntered = this.onServiceCodeEntered.bind(this);
  }
  
  onServiceCodeEntered(serviceCode) {
    //serviceCode should have been already validated here
    const codeVal = encodeURIComponent(serviceCode);

    axios.post(`/activation/checkServiceCode/${codeVal}`,
      {headers: {
        "timeout": 10000, 
      }})
        .then(response => {
          if (response && response.data && response.data.code) {
            this.props.onServiceCodeIsValid(response.data.code);
          }
          else {
            this.setState({
              error: "Введенный код не найден"
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.setState({
            error: "Введенный код не найден"
          });
        });

  }

  render() {
    return(
      <EnterServiceCodeForm onFormSubmit={this.onServiceCodeEntered} error={this.state.error}/>
    );
  }
}

EnterServiceCodeContainer.propTypes = {
  onServiceCodeIsValid : PropTypes.func.isRequired
}

export default EnterServiceCodeContainer;