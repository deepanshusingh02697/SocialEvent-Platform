import { chatPopupContext } from "../Context/ChatPopupContext";
import styles from "./chatPopup.module.css";
import { RxCross2 } from "react-icons/rx";
import { BsChatDotsFill } from "react-icons/bs";
import type {
  GET_ATTENDITES_ChatPopup_Interface,
  GET_USER_JOIN_Interface,
} from "../graphql/client";
import { useAuth } from "../Context/AuthContext";
import { NavLink } from "react-router-dom";

interface ChatPopUpProps {
  userJoinedEvents: GET_USER_JOIN_Interface["userJoinedEvents"];
  eventParticipants: GET_ATTENDITES_ChatPopup_Interface["eventParticipants"];
}
export default function ChatPopup({
  userJoinedEvents,
  eventParticipants,
}: ChatPopUpProps) {
  const { authUserData } = useAuth();
  const { isOpenChat, closeChatPopup } = chatPopupContext();

  console.log(userJoinedEvents);
  console.log(eventParticipants);
  const attendieExceptAuth = eventParticipants.filter(
    (ele) => ele.email !== authUserData?.email,
  );
  console.log(attendieExceptAuth);

  if (!isOpenChat) return null;
  return (
    <>
      <div className={styles.popupCon}>
        <div className={styles.popup}>
          <div className={styles.handleDel}>
            <h3>Attendees</h3>
            <RxCross2 onClick={closeChatPopup} className={styles.cross} />
          </div>
          {attendieExceptAuth.map((ele) => {
            return (  
              <div className={styles.chatBlock}>
                <img src={ele?.profile} alt="" />
                <div className={styles.chatUser}>
                  {ele?.firstname + " " + ele?.lastname}
                </div>
                <NavLink to={`/chat/:${ele.id}`}>
                  <button className={styles.chatbtn}>
                    <BsChatDotsFill />
                    Chat
                  </button>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
