import { useContext } from 'react';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChats , onlineUsers} = useContext(ChatContext);


  // console.log("test",onlineUsers?.some((user)=> u?.data?.user?._id === user?.userId) ?'user-online':"");
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
                <span className={onlineUsers?.some((user)=> u?._id === user?.userId) ?'user-online':""}> </span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChats;
