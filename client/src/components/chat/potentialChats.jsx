import { useContext } from 'react';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChats } = useContext(ChatContext);

  return (
    <>
      <div className='all-users'>
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                className='single-user'
                key={index}
                onClick={() => createChats(user.data.user._id, u._id)}
              >
                {u.name}
                <span className='user-online'> </span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
