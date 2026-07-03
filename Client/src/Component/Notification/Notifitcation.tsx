import { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { socket } from "../../socket";
import styles from "./noitification.module.css";
import { useApolloClient } from "@apollo/client/react";
import { GET_EVENTS_QUERY } from "../graphql/Query";

interface Notification {
  title: string;
  message: string;
  createdAt: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const client = useApolloClient();

  useEffect(() => {
    // socket.on("receive_notification", (data: Notification) => {
    //   setNotifications((prev) => [data, ...prev]);
    // });
    const handler = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

      client.refetchQueries({
        include: [GET_EVENTS_QUERY],
      });
    };
    socket.on("receive_notification", handler);

    return () => {
      socket.off("receive_notification");
    };
  }, [notifications]);

  return (
    <div className={styles.notificationWrapper}>
      <div
        className={styles.notifiCon}
        onClick={() => setOpen((prev) => !prev)}
      >
        <IoMdNotifications className={styles.bell} />

        {notifications.length > 0 && (
          <div className={styles.badge}>{notifications.length}</div>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {/* <h4 style={{textDecoration:"underline",width:"100%",textAlign:"center",marginBottom:"15px"}}>Notifications</h4> */}

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((item, index) => (
              <div key={index} className={styles.notificationItem}>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
                <small>{new Date(item.createdAt).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
