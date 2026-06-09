import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./chat.module.css";
import { IoSend } from "react-icons/io5";
import { socket } from "../../socket";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get_Message_Query } from "../graphql/Query";
import { Message_MUTATION } from "../graphql/Mutation";
import { useAuth } from "../Context/AuthContext";
import type {
  Get_Message_Interface,
  Post_Message_Interface,
} from "../graphql/client";
import { FaArrowLeft } from "react-icons/fa";
import { chatPopupContext } from "../Context/ChatPopupContext";

export default function ChatDetails() {
  const [textinput, setTextinput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { chatId } = useParams();
  const { authUserData } = useAuth();
  const navigate = useNavigate();
  const { closeChatPopup } = chatPopupContext();

  const { data, loading, refetch } = useQuery<Get_Message_Interface>(
    Get_Message_Query,
    {
      variables: { receiverId: Number(chatId) },
      skip: !chatId,
    },
  );

  console.log("data from getMessage: ", data?.getMessages);

  const currentUserId = authUserData?.id;

  const [sendMessage] = useMutation<Post_Message_Interface>(Message_MUTATION);
  const handleNewMessage = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
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
    };
  }, [handleNewMessage]);

  useEffect(() => {
    if (currentUserId) {
      const roomId = [currentUserId, chatId].sort().join("-");
      console.log("room id:", roomId);
      socket.emit("joinRoom", roomId);
    }
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatId]);

  if (!chatId) {
    return <div>No chat selected</div>;
  }

  const handleSendMessage = async () => {
    if (!textinput.trim()) return;
    try {
      const response = await sendMessage({
        variables: { content: textinput, receiverId: Number(chatId) },
      });
      console.log("response after sent message:", response);
      setTextinput("");
    } catch (err) {
      toast("Something went wrong!", {
        position: "top-right",
        type: "warning",
      });
    }
  };
  const handlebackBtn = () => {
    closeChatPopup();
    navigate(-1);
  }

  const receiverName =
    data?.getMessages.find((m) => m.receiverId !== Number(currentUserId))
      ?.receiver?.firstname ?? "User";

  return (
    <>
      <div className="bodyCon">
        <div className={`container ${styles.profileCon}`}>
          <button className={styles.back} onClick={handlebackBtn}>
            <FaArrowLeft /> Back
          </button>
          <div className={styles.con}>
            <div className={styles.body}>
              <div className={styles.chatHeader}>
                <div className={styles.chatAvatar}>
                  {receiverName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className={styles.chatUsername}>{receiverName}</div>
                  <div className={styles.chatUserStatus}>offline</div>
                </div>
              </div>

              <div className={styles.messages}>
                {loading && <p>Loading messages...</p>}

                {data?.getMessages.map((msg) => {
                  const isMe = Number(msg.senderId) === Number(currentUserId);
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
                        {msg.content}
                        <div className={styles.messageTime}>
                          {new Date(Number(msg.createdAt)).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
    </>
  );
}
