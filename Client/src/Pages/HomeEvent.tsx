import styles from "./page.module.css";
import { IoSearch } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { useQuery } from "@apollo/client/react";
import {
  GET_EVENTS_QUERY,
  NEARBY_EVENTS_QUERY,
} from "../Component/graphql/Query";
import type {
  Get_EVENTS_TYPE,
  NEARBY_EVENT_Interface,
} from "../Component/graphql/client";
import { formatDate } from "../Component/Context/conversion";
import { IoPeopleSharp } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function HomeEvent() {
  const [isCatefory, setIsCategory] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const [isDate, setIsDate] = useState("");
  const [isDistance, setIsDistance] = useState(0);
  const [isNearbyMode, setIsNearbyMode] = useState(false);
  const [isallowloc, setIsallowloc] = useState(false);

  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
    );
  }, []);

  const handleDebounce = useMemo(() => debounce(callbackFunc, 500), []);

  function callbackFunc(value: string) {
    setIsSearch(value);
  }

  function debounce(fn: any, delay: number) {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return function (this: any, ...args: any[]) {
      if (timerId !== undefined) clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDebounce(e.target.value);
  };

  const { data, loading } = useQuery<Get_EVENTS_TYPE>(GET_EVENTS_QUERY, {
    skip: isNearbyMode,
    variables: {
      category: isCatefory === "All" ? null : isCatefory,
      toDate: isDate === "" ? null : isDate,
      search: isSearch === "" ? null : isSearch,
      latitude: userCoords?.lat ?? null,
      longitude: userCoords?.lng ?? null,
    },
  });

  console.log("data for distance after query ; ", data);

  const { data: nearbyData, loading: nearbyLoading } =
    useQuery<NEARBY_EVENT_Interface>(NEARBY_EVENTS_QUERY, {
      skip: !isNearbyMode || !userCoords,
      variables: {
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
        radiusKm: isDistance,
        category: isCatefory === "All" ? null : isCatefory,
      },
    });

  const findNearByEvents = () => {
    /* if (isallowloc === true && isDistance < 1) {
      toast("Please select the Distance", {
        position: "top-right",
        type: "info",
      });
      return;
    } */
    if (!navigator.geolocation) {
      toast("Geolocation not supported by your browser", {
        position: "top-right",
        type: "error",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsallowloc(true);
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setIsNearbyMode(true);
        toast("Finding nearby events...", {
          position: "top-right",
          type: "success",
          autoClose: 1500,
        });
      },
      (error) => {
        if (error) {
          toast("Allow your Location", {
            position: "top-right",
            type: "error",
          });
          return;
        }
      },
    );
  };

  const resetNearby = () => {
    setIsNearbyMode(false);
    setIsallowloc(false);
    setUserCoords(null);
    setIsDistance(0);
  };

  const isLoading = isNearbyMode ? nearbyLoading : loading;

  const res = isNearbyMode
    ? nearbyData?.nearbyEvents || []
    : data?.getEvents || [];

  console.log("res is for nearbyevent : ", res);

  const uniqueCategories = [
    "All",
    ...new Set(res.map((cur: any) => cur.category)),
  ];

  if (isLoading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="bodyCon">
        <div className="container">
          <h2 className={styles.eventTitle}>
            {isNearbyMode
              ? `Nearby Events (within ${isDistance} km)`
              : "Discover Events"}
          </h2>

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

              {isNearbyMode && (
                <div
                  className={`${styles.serachBtn} ${styles.clearBtn}`}
                  onClick={resetNearby}
                >
                  ✕ Clear
                </div>
              )}
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
                  {uniqueCategories.map((cur: any) => (
                    <option key={cur} value={cur}>
                      {cur}
                    </option>
                  ))}
                </select>
              </div>

              {!isNearbyMode && (
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
              )}
              {isallowloc ? (
                <>
                  <div className={styles.filterBlock}>
                    <div>Distance: {isDistance} km</div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      className={styles.filterCon}
                      value={isDistance}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setIsDistance(Number(e.target.value))
                      }
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {res.length === 0 ? (
            <p>No events found{isNearbyMode ? " nearby" : ""}.</p>
          ) : (
            <div className={styles.eventCartCon}>
              {res.map((ele: any, idx: number) => (
                <div className={styles.eventCartBlock} key={ele.id || idx}>
                  <NavLink to={`/event/${ele.id}`}>
                    <img src={ele.image} alt={ele.title} />
                  </NavLink>
                  <div className={styles.eventCartBlocktext}>
                    <div className={styles.titleDis}>
                      <div>{ele.category}</div>
                      {/* <div>
                        {isNearbyMode && ele.distance
                          ? `${ele.distance.toFixed(1)} km away`
                          : `${ele.distance || 0} km away`}
                      </div> */}
                      <div>
                        {ele.distance
                          ? `${(ele.distance * 1.60934).toFixed(1)} km away`
                          : ""}
                      </div>
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
                        <FiMapPin className="detailIcon" /> {ele.Eventlocation}
                      </div>
                      <div>
                        <IoPeopleSharp className="detailIcon" />{" "}
                        {ele.attendeeCount} attendees
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
