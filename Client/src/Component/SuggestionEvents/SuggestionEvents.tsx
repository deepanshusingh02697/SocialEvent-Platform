import { useRef } from "react";
import { useQuery } from "@apollo/client/react";
import styles from "./suggestionevent.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GET_PersonalisedEvent_QUERY } from "../graphql/Query";
import type { Get_PersonalisedEvent_Interface } from "../graphql/client";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

interface Props {
  eventDetailCategory: string;
  id: string;
}

export default function SuggestionEvents({ eventDetailCategory, id }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { authUserData, loading } = useAuth();
  const navigate = useNavigate();
  const categories = [
    ...(authUserData?.interests.map((i) => i.interest.name) ?? []),
    eventDetailCategory,
  ];

  const { data, loading: eventLoading } =
    useQuery<Get_PersonalisedEvent_Interface>(GET_PersonalisedEvent_QUERY, {
      variables: {
        category: categories,
        eventDetailId: id,
      },
    });

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  if (loading || eventLoading) {
    return <p>Loading personalised events...</p>;
  }

  return (
    <div className={styles.suggesbody}>
      <button
        className={`${styles.arrow} ${styles.left}`}
        onClick={() => scroll("left")}
      >
        <FaChevronLeft />
      </button>

      <div className={styles.suggesCon} ref={scrollRef}>
        {data?.getPersonalisedEvents.map((cur) => (
          <div className={styles.suggesblock} key={cur.id}>
            <NavLink to={`/event/${cur.id}`}>
              <img
                src={cur.image}
                alt={cur.title}
                className={styles.image}
                onClick={() => navigate(`event/${cur.id}`)}
              />
            </NavLink>
            <div className={styles.suggesBottom}>
              <span className={styles.category}>{cur.category}</span>

              <h3>{cur.title}</h3>

              <p>{cur.Eventlocation}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.right}`}
        onClick={() => scroll("right")}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
