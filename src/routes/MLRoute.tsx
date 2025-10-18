import { checkMLHealth } from '@/api/ApiRequests';
import WakeUpServerLoadingPage from '@/pages/WakeUpServerLoadingPage';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MLRoute = () => {
  // const isHealthy = useHealthStore(state => state.isHealthy);
  // const setIsHealthy = useHealthStore(state => state.setIsHealthy);
  const [isHealthy, setIsHealthy] = useState(false);

  const healthCheck = async () => {
    try {
      const response = await checkMLHealth()
      if (response.status === 200) {
        setIsHealthy(true)
      } else {
        throw new Error('Health check failed')
      }
    } catch (error) {
      console.error('Error during health check:', error)
    } finally {
      setIsHealthy(true)
    }
  }

  useEffect(() => {
    healthCheck();
  }, []);

  if (!isHealthy) {
    return <WakeUpServerLoadingPage />;
  }


  return (
    <>{<Outlet />}</>
  )
};

export default MLRoute;