import { useContext } from 'react';
import { ChatContext } from '../context/chatContext';
import { Container, Stack } from 'react-bootstrap';
import UserChat from '../components/chat/UserChat';
import { AuthContext } from '../context/AuthContext';
import PotentialChats from '../components/chat/potentialChats';

const Chat = () => {
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);
  const { user } = useContext(AuthContext);
  if (userChatsError) {
    return <p>Error: {userChatsError.message}</p>;
  } 
  
  return (
    <Container>
      <PotentialChats/>
      {userChats?.length < 1 ? null : (
      
        <Stack direction='horizontal' gap={4} className='align-items-start'>
          <Stack className='message-box flex-grow-0 pe-3' gap={3}>
            {isUserChatsLoading && <p>Loading Chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div key={index}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <p>ChatBox</p>
        </Stack>
      )
      }
    </Container>
  );
};

export default Chat;
