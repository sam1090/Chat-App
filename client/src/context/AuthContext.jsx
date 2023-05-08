// AuthContext.jsx
import { createContext, useCallback, useEffect, useState } from 'react';
import { postrequest } from '../utils/services,js';
import { baseUrl } from '../utils/services,js';

export const AuthContext = createContext({
  user: null,
  registerInfo: {
    name: '',
    email: '',
    password: '',
  },
  setRegisterInfo: {
    name: '',
    email: '',
    password: '',
  },
  updateRegisterInfo: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  console.log('User', user);

  useEffect(() => {
    const user = localStorage.getItem('User');
    setUser(JSON.parse(user));
  }, []);
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postrequest(
        `${baseUrl}/users/signup`,
        JSON.stringify(registerInfo),
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [registerInfo],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerError,
        registerUser,
        isRegisterLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
