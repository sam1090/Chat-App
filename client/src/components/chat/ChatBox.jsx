import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { ChatContext } from '../../context/chatContext';
import { Stack } from 'react-bootstrap';

const ChatBox = () => {
  const { user } = useContext(AuthContext);

  const { currentChat, messages, isMessagesloading, messagesError } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);



  if (!recipientUser) {
    return (
      <p style={{ textAlign: 'center', width: '100%' }}>
        No conversation selected yet!!
      </p>
    );
  }

  if (isMessagesloading) {
    return (
      <p style={{ textAlign: 'center', width: '100%' }}>Loading Chat...</p>
    );
  }
  return (
    <Stack gap={4} className='chat-box' style={{ height: '100vh'  }}>
      <div className='chat-header'>
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className='messages'>
        {messages &&
          messages.map((message, index) => (
            <Stack key={index} className={`${message?.senderId === user?.data?.user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`} >
              <span>{message.text}</span>
              <span>{moment(message.createdAt).calendar()}</span>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

export default ChatBox;
