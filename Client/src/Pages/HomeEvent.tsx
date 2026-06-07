import styles from "./page.module.css";
import { IoSearch } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import { GET_EVENTS_QUERY } from "../Component/graphql/Query";
import type { Get_EVENTS_TYPE } from "../Component/graphql/client";
import { formatDate } from "../Component/Context/conversion";
import { IoPeopleSharp } from "react-icons/io5";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

export default function HomeEvent() {
  const [isCatefory, setIsCategory] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [isDate, setIsDate] = useState("");
  const [isDistance, setIsDistance] = useState(0);
  const handleDebounce = useMemo(() => debounce(callbackFunc, 500), []);

  //handle Debouncing
  function callbackFunc(value: string) {
    setIsSearch(value);
  }
  function debounce(fn: any, delay: number) {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return function (this: any, ...args: any[]) {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target in seach : ", e.target.value);
    handleDebounce(e.target.value);
  };

  const { data, loading } = useQuery<Get_EVENTS_TYPE>(GET_EVENTS_QUERY, {
    variables: {
      category: isCatefory === "All" ? null : isCatefory,
      toDate: isDate === "" ? null : isDate,
      search: isSearch === "" ? null : isSearch,
    },
  });
  const res = data?.getEvents || [];  

  if (!res.length) {
    return <p>No Event found</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  const uniqueCategoriee = ["All", ...new Set(res.map((cur) => cur.category))];

  const findNearByEvents = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
        },
        (error) => {
          console.log(error.message);
        },
      );
    }
    console.log("distance is : ", isDistance);

    if (isDistance < 1) {
      toast("Please select the Distance", {
        position: "top-right",
        type: "info",
      });
      return;
    }
  };

  return (
    <>
      <div className="bodyCon">
        <div className="container">
          <h2 className={styles.eventTitle}>Discover Events</h2>
          <div className={styles.eventCon}>
            <div className={styles.serachNear}>
              <div className={styles.searchInput}>
                <IoSearch className={styles.searchIcon} />
                <input
                  type="search"
                  placeholder="Search Events..."
                  onChange={handleSearchChange}
                />
              </div>
              <div className={styles.serachBtn} onClick={findNearByEvents}>
                <FiMapPin />
                NearBy
              </div>
            </div>
            <div className={styles.filterSec}>
              <div className={styles.filterBlock}>
                <div>Category</div>
                <select
                  className={styles.filterCon}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setIsCategory(e.target.value)
                  }
                >
                  {uniqueCategoriee
                    ? uniqueCategoriee.map((cur) => {
                        return (
                          <>
                            <option value={cur}>{cur}</option>
                          </>
                        );
                      })
                    : "All"}
                </select>
              </div>
              <div className={styles.filterBlock}>
                <div>Date</div>
                <input
                  type="date"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIsDate(e.target.value)
                  }
                  className={styles.filterCon}
                />
              </div>
              <div className={styles.filterBlock}>
                <div>Distance: {isDistance} km</div>
                <input
                  type="range"
                  min="1"
                  className={styles.filterCon}
                  max="50"
                  value={isDistance}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIsDistance(Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
          <div className={styles.eventCartCon}>
            {res.map((ele, idx) => {
              return (
                <>
                  <div className={styles.eventCartBlock} key={idx}>
                    <NavLink to={`/event/${ele.id}`}>
                      <img src={ele.image} alt={ele.title} />
                    </NavLink>
                    <div className={styles.eventCartBlocktext}>
                      <div className={styles.titleDis}>
                        <div>{ele.category}</div>

                        <div>{ele.distance || 0} km away</div>
                      </div>
                      <h4>{ele.title}</h4>
                      <div className={styles.textCon}>
                        <div className={styles.datetimeCon}>
                          <div>
                            <div>Start-From</div>
                            <div>
                              {formatDate(ele.eventStartDate).toUpperCase()}
                            </div>
                          </div>
                          <div className={styles.datetime}>
                            <div>End-To</div>
                            <div>
                              {formatDate(ele.eventEndDate).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div>
                          <FiMapPin className="detailIcon"/> {ele.Eventlocation}
                        </div>
                        <div>
                          <IoPeopleSharp className="detailIcon"/> {ele.attendeeCount} attendees
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
