import styles from "./jointEvent.module.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
} from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  GET_ATTENDITES_ChatPopup,
  GET_USER_JOIN_QUERY,
} from "../graphql/Query";
import type {
  GET_ATTENDITES_ChatPopup_Interface,
  GET_USER_JOIN_Interface,
} from "../graphql/client";
import { useQuery } from "@apollo/client/react";
import { formatDate } from "../Context/conversion";
import { NavLink } from "react-router-dom";
import { chatPopupContext } from "../Context/ChatPopupContext";
import ChatPopup from "../ChatPopup/ChatPopup";
import { useState } from "react";

export default function JoinEvent() {
  const { setIsOpenChat } = chatPopupContext();
  const [isId, setIsId] = useState("");

  const { data, loading } =
    useQuery<GET_USER_JOIN_Interface>(GET_USER_JOIN_QUERY);

  const { data: chatAttendies } = useQuery<GET_ATTENDITES_ChatPopup_Interface>(
    GET_ATTENDITES_ChatPopup,
    {
      variables: {
        eventId: isId,
      },
    },
  );

  const openChatPopup = (id: string) => {
    setIsOpenChat(true);
    setIsId(id);
  };

  const res = data?.userJoinedEvents;
  if (!res) {
    console.log("res is : ", res);
    return;
  }
  const popupAttendies = chatAttendies?.eventParticipants;
  if (!popupAttendies) {
    console.log("res is : ", res);
    return;
  }

  console.log("joined event by user ", res);

  if (loading) {
    return (
      <>
        <div className="loading">
          <p>Loading...</p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Joined Events</h2>

        <div className={styles.list}>
          {res.map((event) => (
            <div key={event?.id} className={styles.card}>
              <NavLink to={`/event/${event.id}`}>
                <img
                  src={event.image}
                  alt={event?.image}
                  className={styles.image}
                />
              </NavLink>

              <div className={styles.info}>
                <span className={styles.category}>{event?.category}</span>
                <h3 className={styles.eventTitle}>{event?.title}</h3>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <FaCalendarAlt className={styles.icon} />
                    {formatDate(event?.eventStartDate)}
                  </span>
                  <span className={styles.metaItem}>
                    <FaClock className={styles.icon} />
                    {formatDate(event?.eventEndDate)}
                  </span>
                </div>
              </div>

              <div className={styles.right}>
                <div>
                  <RiDeleteBin6Fill />
                </div>
                <span className={styles.metaItem}>
                  <FaMapMarkerAlt className={styles.icon} />
                  {event?.Eventlocation}
                </span>
                <span
                  className={styles.attendees}
                  onClick={() => openChatPopup(event?.id)}
                >
                  <FaUsers className={styles.icon} />
                  {event?.attendeeCount} attendees
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatPopup userJoinedEvents={res} eventParticipants={popupAttendies} />
    </>
  );
}
