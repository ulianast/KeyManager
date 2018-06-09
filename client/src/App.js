import React, { Component } from 'react';
import './App.css';
import Header from './components/AppHeader/Header';
import MainContent from './components/MainContent';
import { MuiThemeProvider } from 'material-ui/styles';
import auth from './utils/auth';
import theme from './AppTheme';

class App extends Component {
  
  constructor(props) {
    super(props);

    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.setCurrentUserData = this.setCurrentUserData.bind(this);

    this.state = {
      authenticated: false,
      currentUser: '',
      currentUserData: {}
    }    
  }

  componentWillMount() {
    this.setCurrentUser(auth.getUser());
  }

  setCurrentUserData(user) {
    this.setState({ currentUserData: user ? user : {} });
  } 

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      });
    } else {
      auth.deauthenticateUser();
      this.setState({
        currentUser: '',
        authenticated: false
      });

    }
  }

  render() {
    const { authenticated, currentUserData } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Header 
            authenticated={authenticated} 
            onUserLogout={this.setCurrentUser}
            user={currentUserData}
          />
          <MainContent 
            onUserLogin={this.setCurrentUser} 
            authenticated={this.state.authenticated}
            onUserAuthenticated={this.setCurrentUserData}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
