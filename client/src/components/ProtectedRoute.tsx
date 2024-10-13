import React, { useContext } from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    component: React.ComponentType<any>;
  }
  
  type Props = ProtectedRouteProps & RouteProps;

const ProtectedRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return user ? (
    <Route {...rest} element={<Component />} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
