import React from 'react'
import {Route , Redirect} from 'react-router-dom'
import AuthService from './AuthService'

const Auth = new AuthService()

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        Auth.checkAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to="/"
          />
        )
      }
    />
  );

export default PrivateRoute