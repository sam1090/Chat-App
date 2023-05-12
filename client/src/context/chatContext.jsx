import { createContext, useEffect, useState } from 'react';
import { baseUrl, getRequest } from '../utils/services.js';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);


  console.log('user',user?.data?.user?._id);
  useEffect(() => {
    const getUserChats = async () => {

      if (user?.data?.user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?.data?.user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ userChats, isUserChatsLoading, userChatsError }}
    >
      {children}
    </ChatContext.Provider>
  );
};
