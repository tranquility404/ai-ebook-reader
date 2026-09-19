import { checkUserAuthStatus } from '@/api/ApiRequests';
import { AuthProvider } from '@/context/AuthContext';
import LoginPage from '@/pages/Auth/LoginPage';
import LoadingPage from '@/pages/LoadingPage';
import { useAuthStatusStore } from '@/store/globalStates';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const LoginRoute = () => {
  const authStatus = useAuthStatusStore((state) => state.authStatus);
  const setAuthStatus = useAuthStatusStore((state) => state.setAuthStatus);

  useEffect(() => {
    if (authStatus !== 'checking') {
      return;
    }

    const checkAuthStatus = async () => {
      try {
        const response = await checkUserAuthStatus();
        setAuthStatus(
          response.status === 200 ? 'authenticated' : 'unauthenticated'
        );
      } catch {
        setAuthStatus('unauthenticated');
      }
    };

    void checkAuthStatus();
  }, [authStatus, setAuthStatus]);

  if (authStatus === 'checking') {
    return <LoadingPage />;
  }

  if (authStatus === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
};

export default LoginRoute;