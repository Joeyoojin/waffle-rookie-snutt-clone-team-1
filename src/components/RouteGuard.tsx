import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

interface RouteGuardProps {
  element: React.JSX.Element;
}

export default function RouteGuard({ element }: RouteGuardProps) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return element;
}
