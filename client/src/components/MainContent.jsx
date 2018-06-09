import React from 'react';
import {Switch, Route} from 'react-router-dom';
import PropTypes from 'prop-types';
//import routes from '../routes.js';
import HomePage from '../scenes/HomePage/Base';
import PdfComponent from '../scenes/PdfComponent';
import UserProfilePage from '../scenes/UserProfilePage/BaseContainer';
//import SignupPage from '../scenes/SignupPage/SignupPageContainer.jsx';
import LoginPage from '../scenes/LoginPage/LoginPageContainer';
import AuthenticatedRoute from './AuthenticatedRoute';

class MainContent extends React.Component {

  render() {
    const { authenticated, onUserLogin, onUserAuthenticated } = this.props;

    return (
      <main>
        <Switch>
          <Route exact path='/' component={HomePage}/>
          
          <AuthenticatedRoute path='/servicePdf/' authenticated={authenticated} component={PdfComponent}/>
          
          <Route 
            path='/login'              
            render={(props) => ( <LoginPage onUserLogin={onUserLogin} {...props}/> )}
          />
          <AuthenticatedRoute
            path="/staffOnly"
            authenticated={authenticated}
            component={UserProfilePage}
            onUserAuthenticated={onUserAuthenticated}
          />

        </Switch>
      </main>
    );
  }
}

MainContent.propTypes = {
  onUserLogin: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  onUserAuthenticated: PropTypes.func.isRequired
}

export default MainContent;