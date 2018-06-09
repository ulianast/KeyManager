import React from 'react';
import EnterServiceCodeContainer from './EnterServiceCodePage/EnterServiceCodeContainer';
import ActivationPage from './ActivationPage/ActivationPage';
import ClientProfilePage from './ClientProfile/ClientProfilePage';
import './styles.css';

const ENTER_CODE_STEP = 0,
      ENTER_PHONE_STEP = 1,
      CLIENT_PROFILE = 2;

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: ENTER_CODE_STEP,
      service : {
        id: null,
        name: '',
        code: ''
      },
    }

    this.onServiceCodeIsValid = this.onServiceCodeIsValid.bind(this);
    this.onActivationSuccess = this.onActivationSuccess.bind(this);
  }

  onServiceCodeIsValid(service) {
    console.log(service);
    this.setState({
      step: service.activated ? CLIENT_PROFILE : ENTER_PHONE_STEP,
      service: {
        id: service.id,
        name: service.name,
        code: service.code
      }
    })
  }

  onActivationSuccess() {
    this.setState({
      step: CLIENT_PROFILE
    });
  }

  render() {
    const {step, service} = this.state;

    return (
      <div className="home-container">
        {step === ENTER_CODE_STEP && <EnterServiceCodeContainer onServiceCodeIsValid={this.onServiceCodeIsValid}/>}
        {step === ENTER_PHONE_STEP && <ActivationPage service={service} onActivationSuccess={this.onActivationSuccess}/>}
        {step === CLIENT_PROFILE && <ClientProfilePage serviceCode={service.code}/>}
      </div>
    );
  }
}

export default HomePage;