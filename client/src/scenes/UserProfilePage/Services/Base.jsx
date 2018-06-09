import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import NewService from './NewService/NewServiceContainer';
import ServiceList from './ServicesList/ServicesListContainer';
import SmartTable from '../../../components/SmartTable/SmartTable';
import auth from '../../../utils/auth';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TabHeader from '../../../components/TabHeader/TabHeader';
import ErrorStatus from '../../../components/ErrorStatus/ErrorStatus';

class Base extends React.PureComponent{ 

  constructor(props) {
    super(props);

    this.state = {
      searchVal: '',
      services: [],
      filteredServices: [],
      error: '',
      isServiceTableVisible: props.user ? props.user.role === 'super_admin' : false,
      isServiceListVisible: props.user ? props.user.role === 'seller' : false
    }

    this.onSearchInputChanged = this.onSearchInputChanged.bind(this);
    this.fetchServices = this.fetchServices.bind(this);
  }

  componentDidMount() {
    this.fetchServices();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        isServiceTableVisible: nextProps.user.role === 'super_admin',
        isServiceListVisible: nextProps.user.role === 'seller'
      });
    }
  }

  onSearchInputChanged(event) {
    const searchValue = event.target.value;

    if (searchValue) {
      const filtereItems = _.filter(this.state.services, item => {
        return _.startsWith(item.name, searchValue);
      });
      this.setState({
        filteredServices: filtereItems,
        searchVal: searchValue
      });
    }
    else {
      this.setState({
        filteredServices: _.clone(this.state.services),
        searchVal: searchValue
      })
    }
  } 

  /**
  * Fetch services from db server
  */
  fetchServices() {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/services', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
      }})
      .then(response =>{
        if (response && response.data && response.data.services) {
          this.setState({
            services: response.data.services,
            filteredServices: _.clone(response.data.services)
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
    const { filteredServices, isServiceTableVisible, isServiceListVisible } = this.state;
    const tableHeaders = [
      { id: 'name', numeric: false, label: 'Сервисный пакет' },
      { id: 'servicePrice', numeric: true, label: 'Цена' }, 
      { id: 'createdAt', numeric: true, isDateType: true, label: 'Создан' },
    ];
    const inlineTableHeaders = [
      { id: 'name', numeric: false, label: 'Лицензия' },
      { id: 'price', numeric: true, label: 'Цена' }
    ];

    return (
      <div>
        <TabHeader tabText="Сервисные пакеты"/>
        <ErrorStatus error={this.state.error} />
        <div className="control-fields">
          <FormControl aria-describedby="search" className="search-field">
            <InputLabel htmlFor="search">Поиск</InputLabel>
            <Input 
              id="search"
              label="Поиск"
              type="search"
              className="search-input"
              name="search"
              onChange={this.onSearchInputChanged}
              value={this.state.searchVal}
            />
          </FormControl>
          {isServiceTableVisible && <NewService onServiceAdded={this.fetchServices}/>}
        </div>
        
        {isServiceTableVisible &&
          <SmartTable
            columnHeaders={tableHeaders}
            data={filteredServices}
            isExpandable={true}
            inlineTableHeaders={inlineTableHeaders}
            inlineTableDataName="licences"
            disableToolbar={true}
          />
        }

        {isServiceListVisible &&
          <ServiceList services={filteredServices}/>
        }
      </div>
    );
  }
}

export default Base;
