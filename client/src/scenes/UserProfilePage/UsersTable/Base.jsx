import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import SmartTable from '../../../components/SmartTable/SmartTable';
import auth from '../../../utils/auth';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import TabHeader from '../../../components/TabHeader/TabHeader';
import ErrorStatus from '../../../components/ErrorStatus/ErrorStatus';
import NewUserModal from './NewUserModal';
import EditableUserTable from './EditableUserTable';


class Base extends React.PureComponent {
  
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      searchVal: '',
      users: [],
      filteredUsers: []
    }
  }

  componentDidMount() {
    this.fetchUsers();
  }

  onRowEdit = (row) => {
    console.log(row);
  }

  onSearchInputChanged = (event) => {
    const searchValue = event.target.value;
    
    this.setState({
      filteredUsers: this.getFilteredUsers(searchValue, this.state.users),
      searchVal: searchValue
    });
  }

  getFilteredUsers = (searchValue, users) => {
    let filtereItems = [];

    if (searchValue) {
      const searchValLowercased = searchValue.toLowerCase();
      
      filtereItems = _.filter(users, item => {
        return item.fullName.toLowerCase().indexOf(searchValLowercased) !== -1 ||
               item.login.toLowerCase().indexOf(searchValLowercased) !== -1;
      });
    }
    else {
      filtereItems = _.clone(users);
    }

    return filtereItems
  }

  fetchUsers = () => {
    const token = auth.getToken();
    const authHeader = `JWT ${token}`;

    axios.get('/staffOnly/users', { headers: {
      "timeout": 10000, 
      "Authorization": authHeader 
    }})
    .then(response =>{
      if (response && response.data && response.data.users) {
        this.setState({
          users: response.data.users,
          filteredUsers: this.getFilteredUsers(this.state.searchVal, response.data.users)
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
    const { error, searchVal, filteredUsers } = this.state;
    // const tableHeaders = [
    //   { id: 'fullName', numeric: false, label: 'ФИО' },
    //   { id: 'login', numeric: false, label: 'Логин' }, 
    //   { id: 'role', numeric: false, label: 'Статус' },
    //   { id: 'shops', numeric: false, label: 'Торговая(ые) точка(и)' },
    // ];

    return (
      <div>
        <TabHeader tabText="Таблица пользователей"/>
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
          <NewUserModal onNewUserAdded={this.fetchUsers}/>
        </div>
        
        <EditableUserTable
          users={filteredUsers}
          onUserEditted={this.fetchUsers}
        />
        
      </div>
    )
  }
}

export default Base;