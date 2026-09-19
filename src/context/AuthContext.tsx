import { useAuthHelper } from '@/controllers/LoginControl';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext<any|undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
    const navigate = useNavigate();
    const { initiateLogin, initiateRegistration } = useAuthHelper();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const validateCredentials = (event: any) => {
        event.preventDefault();
        setError('');

        if (email === '') {
            setError('Enter Email');
            return;
        } else if (password === '') {
            setError('Enter Password');
            return;
        } else if (!isLogin) {
            if (firstName == "") {
                setError('First Name is required');
                return;
            } else if (lastName == "") {
                setError('Last Name is required');
                return;
            }
        }

        if (email.length > 4 && password.length > 4) {
            if (!isLogin)
                initiateRegistration(firstName, lastName, email, password, navigate);
            else
                initiateLogin(email, password, navigate)
            return;
        } else {
            setError('Inavalid Email or Password');
            return;
        }
    };

  useEffect(() => {
    
  }, []);

  return (
    <AuthContext.Provider value={{ firstName, setFirstName, lastName, setLastName, email, setEmail, password, setPassword, error, setError, isLogin, setIsLogin, validateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};
