import { useAuthStatusStore } from '@/store/globalStates';
import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingPage from '@/pages/LoadingPage';

const ProtectedRoute = () => {
  const authStatus = useAuthStatusStore((state) => state.authStatus);
  const setAuthStatus = useAuthStatusStore((state) => state.setAuthStatus);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setAuthStatus(token ? 'authenticated' : 'unauthenticated');
  }, [setAuthStatus]);

  return (
    <>
      {authStatus === 'checking' ? (
        <LoadingPage />
      ) : authStatus === 'authenticated' ? (
        <Outlet />
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default ProtectedRoute;