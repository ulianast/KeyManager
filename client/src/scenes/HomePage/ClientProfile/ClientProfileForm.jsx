import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import TabHeader from '../../../components/TabHeader/TabHeader';
import Chip from 'material-ui/Chip';
import ServiceCode from '../../../components/ServiceCode/ServiceCode';
import PercentageCircle from '../../../components/PercentageCircle/PercentageCircle';
import './styles.css';

class ClientProfileForm extends React.PureComponent {

  render() {
    const { services, userPhone } = this.props;

    return (
      <div>
        <TabHeader tabText="Добро пожаловать в личный кабинет клиента"/>
        <Paper elevation={4} >
          <div className="header-paper">
            <div className="phone-header-card">
              {userPhone}
            </div>
            <div className="vertical-separator">-</div>
            <div className="services-header-card">
              <div className="services-header-card-title">
                Мои сервисные пакеты
              </div>
              <PercentageCircle val={services.length} className="services-header-card-circle"/>
            </div>
          </div> 
        </Paper>

        {services.map((service, index) => {
          return (
            <ExpansionPanel key={index}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className="expansion-list-header-item">{service.name}</Typography>
                <ServiceCode className="expansion-list-header-item-secondary" serviceCode={service.code}/>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className="flex-column">
                {service.licences.map((licence,index) => {
                  return(
                    <div key={index} className="licence-line">
                      <Chip label={licence.name} className="red-hot-chili-peppers"/>
                    
                      <span className="licence-code">
                        {licence.code}
                      </span>
                    </div> 
                  )
                })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </div>
    );
  }
}

ClientProfileForm.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object).isRequired,
  userPhone: PropTypes.string
}

export default ClientProfileForm;