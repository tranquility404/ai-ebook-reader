import { checkUserAuthStatus } from '@/api/ApiRequests';
import { AuthProvider } from '@/context/AuthContext';
import LoginPage from '@/pages/Auth/LoginPage';
import { useAuthStatusStore } from '@/store/globalStates';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStatusStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useAuthStatusStore((state) => state.setIsAuthenticated);

  const checkAuthStatus = async () => {
    try {
      const res = await checkUserAuthStatus();
      setIsAuthenticated(res.status == 200);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);


  return (
    <>
      {/* auth-status: {isAuthenticated.toString()} */}
      {
      isAuthenticated ? <Outlet /> : 
      <AuthProvider>
        <LoginPage />

      </AuthProvider>
      }
    </>
  )
};

export default ProtectedRoute;