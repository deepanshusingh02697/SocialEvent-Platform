/* import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";
import { IoSend } from "react-icons/io5";

export default function ChatDetails() {
  const client = useApolloClient();
  const [textinput, setTextinput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery<getmessageType>(
    GET_MESSSAGES_QUERY,
    {
      variables: { receiverId: selectedUserId?.id },
      skip: !selectedUserId,
    },
  );
  const { data: allUsers } = useQuery<getAllUserType>(GET_ALL_USER_QUERY);
  const { data: curUser } = useQuery<getAuthenticUserType>(
    GET_AUTHENTIC_USER_QUERY,
  );

  const currentUserId = curUser?.currentUser?.user?.id;

  const handleNewMessage = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("connect", () => {
      console.log("socket : ", socket.id);
    });
    socket.on("newRoomMessage", (newMessage) => {
      console.log("received : ", newMessage);
      handleNewMessage();
      setTextinput("");
    });
    return () => {
      socket.off("connect");
      socket.off("newRoomMessage");
      socket.disconnect();
    };
  }, [handleNewMessage]);

  const [sendMessage] = useMutation<sentMessageType>(SEND_MESSAGE_MUTATION);

  const handleSendMessage = async () => {
    if (!textinput.trim()) return;
    const response = await sendMessage({
      variables: {
        text: textinput,
        receiverId: selectedUserId?.id,
      },
    });
    if (!response) {
      toast("Something went wrong!", {
        position: "top-right",
        type: "warning",
      });
      return;
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.container}>
          <div className={styles.body}>
            <div className={styles.chatHeader}>
              <div className={styles.chatAvatar}>
                {selectedUserId?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={styles.chatUsername}>
                  {selectedUserId?.username}
                </div>
                <div className={styles.chatUserStatus}>
                  {selectedUserId?.isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className={styles.messages}>
              {data?.getMessages.map((msg) => {
                const isMe = Number(msg.senderId) === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${
                      isMe ? styles.messageRowMe : styles.messageRowOther
                    }`}
                  >
                    <div
                      className={`${styles.bubble} ${
                        isMe ? styles.bubbleMe : styles.bubbleOther
                      }`}
                    >
                      {msg.text}
                      <div className={styles.messageTime}>
                        Date
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className={styles.inputBar}>
              <input
                type="text"
                value={textinput}
                onChange={(e) => setTextinput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className={styles.input}
              />
              <button onClick={handleSendMessage} className={styles.sendBtn}>
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 */

import { useRef } from "react";
import styles from "./chat.module.css";
import { IoSend } from "react-icons/io5";

export default function ChatDetails() {
  const bottomRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.con}>
          <div className={styles.body}>
            <div className={styles.chatHeader}>
              <div className={styles.chatAvatar}>
                {/* {selectedUserId?.username?.charAt(0).toUpperCase()} */}R
              </div>
              <div>
                <div className={styles.chatUsername}>
                  {/* {selectedUserId?.username} */}Rohan kumar
                </div>
                <div className={styles.chatUserStatus}>
                  {/* {selectedUserId?.isOnline ? "Online" : "Offline"} */}
                  offline
                </div>
              </div>
            </div>
            <div className={styles.messages}>
              {/* {data?.getMessages.map((msg) => {
                const isMe = Number(msg.senderId) === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${
                      isMe ? styles.messageRowMe : styles.messageRowOther
                    }`}
                  >
                    <div
                      className={`${styles.bubble} ${
                        isMe ? styles.bubbleMe : styles.bubbleOther
                      }`}
                    >
                      {msg.text}
                      <div className={styles.messageTime}>
                        Date
                      </div>
                    </div>
                  </div>
                );
              })} */}
              <div className={styles.messageRowMe}>
                <div className={`${styles.bubble} ${styles.bubbleMe}`}>
                  Hey how are you
                  <div className={styles.messageTime}>Date</div>
                </div>
              </div>
              <div ref={bottomRef} />
            </div>
            <div className={styles.inputBar}>
              <input
                type="text"
                // value={textinput}
                // onChange={(e) => setTextinput(e.target.value)}
                // onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className={styles.input}
              />
              {/* <button onClick={handleSendMessage} className={styles.sendBtn}> */}
              <button className={styles.sendBtn}>
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
