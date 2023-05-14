import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avarter from "../../assets/avarter.svg"

const UserChat = ({chat, user}) => {

  const {recipientUser} = useFetchRecipientUser(chat, user);

  return (<Stack direction="horizontal" gap={3} className="user-card align-items-cemter p-2 justify-content-between" role="button">

    <div className="d-flex">
      <div className="me-2">
        <img src={avarter} height="35px"/>
      </div>
      <div className="text-content">
        <div className="name">{recipientUser?.name}</div>
        <div className="text">Text message</div>
      </div>
    </div>

    <div className="d-flex flex-column align-items">
      <div className="date">12/12/2023</div>
      <div className="this-user-notifications ">2</div>
      <span className="user-online"></span>
    </div>

  </Stack>);
};

export default UserChat;
