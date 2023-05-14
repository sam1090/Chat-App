import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest , postrequest} from '../utils/services.js';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log('error fetching users', response);
      }

      const pChats = response.filter((u) => {
        let isChatCreated = false;

        if (user?.data?.user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?.data?.user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(
          `${baseUrl}/chats/${user?.data?.user?._id}`,
        );

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  const createChats = useCallback(async (firstId, secondId) => {
    const response = await postrequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      }),
    );

    if (response.error) {
      return console.log('Error creating chat', response);
    }
    setUserChats((prev) => [...prev, response]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
