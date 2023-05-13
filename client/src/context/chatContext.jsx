import { createContext, useEffect, useState } from 'react';
import { baseUrl, getRequest } from '../utils/services.js';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats , setPotentialChats] = useState(null);
useEffect(()=>{
  const getUsers = async()=>{
    const response = await getRequest(`${baseUrl}/users`);

 
    if (response.error) {
      return console.log("error fetching users",response);
    }

    const pChats = response.filter((u)=>{
      let isChatCreated = false;

      if(user.data.user._id === u._id) return false;

      if(userChats){
        userChats?.some((chat)=>{
          return chat.members[0] === u._id || chat.members[1] === u._id
        })
      }

    })

  };
  getUsers();

})


  useEffect(() => {
    const getUserChats = async () => {

      if (user?.data?.user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/getUser/${user?.data?.user?._id}`);

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
