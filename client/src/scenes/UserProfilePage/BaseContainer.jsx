import React from 'react';
import {Switch, Route} from 'react-router-dom';
import axios from 'axios';

import UserNavMenu from './UserNavMenuContainer/UserNavMenuContainer';
import { PROFILE_TAB, ACTIVATION_TABLE, NEW_USER, USER_TABLE, ADD_SVG, SERVICES, SELLER_STAT } from './constants';
//import UserProfile from './UserProfile/UserProfile';
import NewUserContainer from './NewUser/NewUserContainer';
import AddLicenceCodes from './AddLicenceCodes';
import ActivationTablePage from './ActivationTablePage';
import SellersStatTable from './SellersStatTable/Base';
import UsersTable from './UsersTable/Base';
import Services from './Services/Base';
import Authorization from '../../components/Authorization';
import auth from '../../utils/auth';
import grey from 'material-ui/colors/grey';

const baseContainer = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '100%',
  minHeight: '100vh'
};
const navMenuContainer = {
  flex: '1 1 30%',
  maxWidth:'300px',
  backgroundColor: grey[700]
};
const mainContentContainer = {
  flex: '1 1 70%',
  backgroundColor: '#F5F5F5'
};


class BaseContainer extends React.Component {
	  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.onNavItemChosen = this.onNavItemChosen.bind(this);
  }

  componentDidMount() {
    const token = auth.getToken();
    const authUser = auth.getUser();
    const authHeader = `JWT ${token}`;
    axios.get(`/staffOnly/user/${authUser}`, {headers: {
            "timeout": 10000, 
            "Authorization": authHeader 
    }})
      .then(response =>{
        if (response && response.data && response.data.user) {
          this.setState({
            user: response.data.user
          });
          this.props.onUserAuthenticated(response.data.user);
        }
        else {
          auth.deauthenticateUser();
          this.props.onUserAuthenticated(null);
          this.props.history.push('/login');          
        }
      })
      .catch(error => {
        auth.deauthenticateUser();
        this.props.onUserAuthenticated(null);
        this.props.history.push('/login');
      });
  }

  onNavItemChosen(section) {
    if (section && typeof section === 'string' && section.trim().length !== 0) {
      // if (section.trim() === PROFILE_TAB) {
      //   this.props.history.push('/staffOnly/profile');
      // }
      if (section.trim() === ACTIVATION_TABLE) {
        this.props.history.push('/staffOnly/activationTable');
      }
      else if (section.trim() === SELLER_STAT) {
        this.props.history.push('/staffOnly/sellerStat');
      }
      else if (section.trim() === NEW_USER) {
        this.props.history.push('/staffOnly/newUser');    
      }
      else if (section.trim() === USER_TABLE) {
        this.props.history.push('/staffOnly/userTable');
      }
      else if (section.trim() === ADD_SVG) {
        this.props.history.push('/staffOnly/addSvg');
      }
      else if (section.trim() === SERVICES) {
        this.props.history.push('/staffOnly/services');
      }
    }
  }

  render() {
    return (
      <div style={baseContainer}>
        <div style={navMenuContainer}>
          <UserNavMenu
            defaultValue={PROFILE_TAB}
            onItemChosen={this.onNavItemChosen}
          />
         </div> 
          
        <div style={mainContentContainer}>
          <Switch>
            <Route path='/staffOnly/newUser'
              render={(props) => ( <NewUserContainer user={this.state.user} {...props}/> )}/>
            <Route path='/staffOnly/addSvg'
              render={(props) => ( <AddLicenceCodes user={this.state.user} {...props}/> )}/>
            <Route path='/staffOnly/services'
              render={(props) => ( <Services user={this.state.user} {...props}/> )}/>
            <Route path='/staffOnly/activationTable'
              render={(props) => ( <ActivationTablePage user={this.state.user} {...props}/> )}/>
            <Route path='/staffOnly/sellerStat'
              render={(props) => ( <SellersStatTable user={this.state.user} {...props}/> )}/>
            <Route path='/staffOnly/userTable'
              render={(props) => ( <UsersTable user={this.state.user} {...props}/> )}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default BaseContainer