import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl, getRequest, postrequest } from '../utils/services.js';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  //initial socket

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', user?.data?.user?._id);

    socket.on('getOnlineUsers', (res) => {
      setOnlineUsers(res);
    });
  }, [socket]);

  //send messages
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find(
      (id) => id !== user?.data?.user?._id,
    );

    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

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

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`,
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  //recieve messages
  useEffect(() => {
    if (socket === null) return;

    socket.on('getMessage', (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev)=>[...prev, res])
    });

    return () => {
      socket.off('getMessage');
    };
  }, [socket, currentChat]);

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

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      console.log('sender', sender);
      if (!textMessage) return console.log('You must type something !');

      const response = await postrequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender.data.user._id,
          text: textMessage,
        }),
      );

      if (response.error) {
        return sendTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage('');
    },
    [],
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChats,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
