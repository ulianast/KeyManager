import React from 'react';
import PropTypes from 'prop-types';

// Authorization HOC
const Authorization = (WrappedComponent, allowedRoles) => {
  return class WithAuthorization extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        userIsLoaded : props.user != null,
        user: props.user
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.user) {
        this.setState({
          userIsLoaded : nextProps.user != null,
          user: nextProps.user
        });
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      const { user, userIsLoaded } = nextState;

      return !(userIsLoaded && allowedRoles.includes(user.role));
    }

    render() {
      const { user, userIsLoaded } = this.state;
      
      if (!userIsLoaded || allowedRoles.includes(user.role)) {
        return <WrappedComponent {...this.props} />
      } 
      else {
        return <h1>Access denied</h1>
      }
    }
  }
}

Authorization.propTypes = {
  user : PropTypes.object
}

export default Authorization;