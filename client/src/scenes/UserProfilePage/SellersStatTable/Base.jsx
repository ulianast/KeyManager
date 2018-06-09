import React from 'react';
import _ from 'lodash';
import axios from 'axios';
// import NewService from './NewService/NewServiceContainer';
// import ServiceList from './ServicesList/ServicesListContainer';
import NetworksList from './NetworksListComponent';
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
      tradeNetworks: [],
      filteredNetworks: [],
      error: '',
      users: [],
      isNetworksTableVisible: props.user ? props.user.role === 'super_admin' : false,
      isUsersTableVisible: props.user ? props.user.role === 'admin' : false
    }

    this.onSearchInputChanged = this.onSearchInputChanged.bind(this);
    this.fetchUsers = this.fetchUsers.bind(this);
  }

  componentDidMount() {
    this.fetchUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        isNetworksTableVisible: nextProps.user.role === 'super_admin',
        isUsersTableVisible: nextProps.user.role === 'admin'
      });
    }
  }

  onSearchInputChanged(event) {
    const searchValue = event.target.value;

    if (searchValue) {
      const searchValLowecCased = searchValue.toLowerCase();
      const filtereItems = _.filter(this.state.tradeNetworks, item => {
        return _.startsWith(item.name.toLowerCase(), searchValLowecCased);
      });

      this.setState({
        filteredNetworks: filtereItems,
        searchVal: searchValue
      });
    }
    else {
      this.setState({
        filteredNetworks: _.clone(this.state.tradeNetworks),
        searchVal: searchValue
      })
    }
  } 

  /**
  * Fetch users from db server
  */
  fetchUsers() {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/usersStat', {headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response =>{
      if (response && response.data ) {
        if (_.isArray(response.data.networks)) {
          this.setState({
            tradeNetworks: response.data.networks,
            filteredNetworks: _.clone(response.data.networks),
            users: (response.data.networks.length === 1 && _.isArray(response.data.networks[0].users)) ?
              response.data.networks[0].users :
              []
          });
        }
        // else if (response.data.users) {
        //   this.setState({
        //     users: response.data.users
        //   });
        // }          
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
    const { tradeNetworks, users, filteredNetworks, isNetworksTableVisible, isUsersTableVisible } = this.state;
    const usersTableHeaders = [
      { id: 'name', numeric: false, label: 'ФИО' },
      { id: 'login', numeric: false, label: 'Логин' }, 
      { id: 'activations', numeric: true, label: 'Всего активаций' },
      { id: 'activationsPerMonth', numeric: true, label: 'Активаций за текущий месяц' },
    ];

    return (
      <div>
        <TabHeader tabText="Общая статистика консультантов"/>
        <ErrorStatus error={this.state.error} />
        
        {isNetworksTableVisible && 
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
          </div>
        }
        
        {isUsersTableVisible &&
          <SmartTable
            columnHeaders={usersTableHeaders}
            data={users}
            title="Консультанты"
          />
        }

        {isNetworksTableVisible &&
          <NetworksList 
            usersTableHeaders={usersTableHeaders}
            data={filteredNetworks}/>
        }
      </div>
    );
  }
}

export default Base;
