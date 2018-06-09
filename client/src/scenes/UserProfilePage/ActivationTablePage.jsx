import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import auth from '../../utils/auth';
import SmartTable from '../../components/SmartTable/SmartTable';
import DateRange from '../../components/DateRange/DateRange';
import ErrorStatus from '../../components/ErrorStatus/ErrorStatus';
import TabHeader from '../../components/TabHeader/TabHeader';
import Authorization from '../../components/Authorization';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';



class ActivationPageTable extends React.PureComponent{ 

  constructor(props) {
    super(props);

    this.state = {
      activations : [],
      filteredActivations : [],
      error : '',
      searchVal : '',
      startDate: null,
      endDate: null,
      focusedInput: null
    }

    this.onDateRangeChanged = this.onDateRangeChanged.bind(this);
  }

  componentDidMount() {
    this.fetchActivations();
  }

  onDateRangeChanged(startDate, endDate) {
    const {activations} = this.state;
    let filteredActivations = [];

    if (startDate) {
      for (let i = 0; i < activations.length; i++) {
        const item = activations[i];

        try {
          if (item.createdAt) {
            if (endDate.isAfter(item.createdAt)) {
              if (startDate.isBefore(item.createdAt)) {
                filteredActivations.push(item);
              }
              else {
                break;
              }
            }
          }
        }
        catch(ex) {
          //Just skip it
          continue;
        }
      }
    }
    else {
      filteredActivations = _.clone(activations);
    }

    this.setState({
      filteredActivations: filteredActivations
    })
  } 

  /**
  * Fetch services from db server
  */
  fetchActivations() {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/activations', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
      }})
      .then(response => {
        if (response && response.data && response.data.activations) {
          this.setState({
            activations: response.data.activations,
            filteredActivations: _.clone(response.data.activations)
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

  render() {
    const {filteredActivations, error, searchVal} = this.state;

    const tableHeaders = [
      { id: 'code', numeric: false, label: 'Код активации' },
      { id: 'service', numeric: false, label: 'Сервисный пакет' },
      { id: 'createdAt', numeric: true, isDateType: true, label: 'Создан' },
      { id: 'activatedAt', numeric: true, isDateType: true, label: 'Активирован' },
      { id: 'staffUser', numeric: false, isFilterEnabled: true, label: 'Продавец' },
      { id: 'shop', numeric: false, isFilterEnabled: true, label: 'Торговая точка' },
      { id: 'client', numeric: false, label: 'Клиент' }
    ];

    return(
      <div>
        <TabHeader tabText="Таблица активаций"/>
        <ErrorStatus error={error} />
        <div className="control-fields">   
          <DateRange onRangeSet={this.onDateRangeChanged}/>
        </div>
        <SmartTable
          columnHeaders={tableHeaders}
          data={filteredActivations}
          disableToolbar={true}
          isFilterable={true}
        />
      </div>
    );
  }
}

export default Authorization(ActivationPageTable, ['super_admin', 'admin', 'seller']);