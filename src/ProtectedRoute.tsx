import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface Props {
  path?: string;
  component?: React.FC;
  render?: () => React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({path, component, render}) => {
  const isAuthenticated = true;

  if (isAuthenticated) {
    return <Route path={path} component={component} render={render} />
  }
  
  return <Redirect to="/signin" />;
};

