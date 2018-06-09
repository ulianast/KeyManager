import React from 'react';
import {Route, Redirect} from 'react-router-dom';

// AuthenticatedRoute added above App component
export default function AuthenticatedRoute({component: Component, authenticated, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
          ? <Component {...props} {...rest} />
          : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
  )
}