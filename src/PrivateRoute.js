import React, { useContext } from 'react';
import { Route } from 'react-router-dom';

import { AuthContext } from './Auth';
import Ad from './components/Ad';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(routeProps) => (
        <>
          {!currentUser && <Ad />}
          <RouteComponent {...routeProps} />
        </>
      )}
    />
  );
};

export default PrivateRoute;
