import React from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import PhoneInput from '../../../components/PhoneInput';
import ErrorStatus from '../../../components/ErrorStatus/ErrorStatus';
import ServiceCode from '../../../components/ServiceCode/ServiceCode';
import './styles.css';

class ActivationForm extends React.Component {
  render() {
    const {service, phone, errors, onChange, onPhoneSubmit, onFormSubmit} = this.props;

    return ([
      <ErrorStatus error={errors.summary} key="error"/>,

      <Paper elevation={4} className="activation-form-card" key="activation-form">
        <div className="activation-form-header">
          <div className="text-line service-code-line">
            <ServiceCode className="field-item-val" serviceCode={service ? service.code : ''}/>
            <p className="field-item-label">Ваш код сервисного пакета</p>
          </div>

          <div className="text-line">
            <p className="field-item-val">{service ? service.name : ''}</p>
            <p className="field-item-label">Ваш сервисный пакет</p>
          </div> 
        </div>       
 
        <form action="/" onSubmit={onFormSubmit}>  

          <div className="text-line service-phone-line">
            <FormControl  aria-describedby="phone">
              <InputLabel htmlFor="phone">Ваш номер телефона</InputLabel>                
                <Input 
                  id="phone" 
                  value={phone.value} 
                  onChange={onChange} 
                  type="text" 
                  name="value"
                  inputComponent={PhoneInput}
                />                
              {errors.phone && 
                <FormHelperText className="" error id="phone-error-text">{errors.phone}</FormHelperText>
              }
            </FormControl> 

            <Button variant="raised" color="primary" onClick={onPhoneSubmit} className="phone-button">
              Отправить
            </Button>        
          </div>

          <div className="text-line">
            <FormControl  aria-describedby="code">
              <InputLabel htmlFor="phone">Введите код из SMS сообщения</InputLabel>                
                <Input 
                  id="code" 
                  value={phone.code} 
                  onChange={onChange} 
                  type="text" 
                  name="code"
                />                
              {errors.code && 
                <FormHelperText className="" error id="phone-code-error-text">{errors.code}</FormHelperText>
              }
            </FormControl> 
          </div>

          <div className="button-line">
            <Button variant="raised" type="submit" color="primary" onClick={onFormSubmit}>
              Активировать
            </Button>    
          </div>

        </form>
      </Paper>
    ]);
  }
}

ActivationForm.propTypes = {
  service : PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  phone: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onPhoneSubmit: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired
}

export default ActivationForm;