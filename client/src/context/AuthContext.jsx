// AuthContext.jsx
import { createContext, useCallback, useEffect, useState } from 'react';
import { postrequest } from '../utils/services.js';
import { baseUrl } from '../utils/services.js';

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
  loginInfo: {
    email: '',
    password: '',
  },
  setLoginInfo: {
    email: '',
    password: '',
  },
  updateLoginInfo: () => {},
});

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [registerInfo, setRegisterInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  console.log('User', user);
  console.log('login', loginInfo);

  useEffect(() => {
    const user = localStorage.getItem('User');
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
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

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postrequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo),
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem('User', JSON.stringify(response));
      setUser(response);
    },
    [loginInfo],
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('User');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerError,
        registerUser,
        isRegisterLoading,
        loginInfo,
        updateLoginInfo,
        loginError,
        loginUser,
        isLoginLoading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
