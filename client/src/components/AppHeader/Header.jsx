import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import UserProfile from './UserShortProfile';

const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: grey[800]
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {

  render() {
    const { classes, authenticated, user, onUserLogout } = this.props;

    return (
      <AppBar position="static" className={classes.root}>
        <Toolbar className="header-toolbar">
          <img src="/images/logo.svg"/>
          <Typography/>
          {authenticated && 
            <UserProfile user={user} onUserLogout={onUserLogout}/>            
          }
        </Toolbar>
      </AppBar>
    );
   }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onUserLogout: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.object
};

export default withStyles(styles)(Header);