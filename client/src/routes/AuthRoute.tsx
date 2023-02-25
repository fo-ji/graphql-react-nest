import { useAuth } from '@/hooks/useAuth';
import type { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { authInfo } = useAuth();

  if (!authInfo.checked) {
    return <div>Loading...</div>;
  }

  if (authInfo.isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/signin" />;
};

export const PublicRoute: FC<PropsWithChildren> = ({ children }) => {
  const { authInfo } = useAuth();

  if (!authInfo.checked) {
    return <div>Loading...</div>;
  }

  if (authInfo.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
