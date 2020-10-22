import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {isAuthenticated} from './utils';

interface Props {
  path?: string;
  component?: React.FC;
  render?: () => React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({path, component, render}) => {
  const authenticated = isAuthenticated();

  if (authenticated) {
    return <Route path={path} component={component} render={render} />
  }
  
  return <Redirect to="/signin" />;
};

