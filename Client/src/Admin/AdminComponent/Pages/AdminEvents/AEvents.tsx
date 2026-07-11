import styles from "./aevent.module.css";
import { IoMdAdd } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { Get_EVENTS_TYPE } from "../../../../Component/graphql/client";
import { GET_EVENTS_QUERY } from "../../../../Component/graphql/Query";
import { formatDate } from "../../../../Component/Context/conversion";
import { useEditContext } from "../../../AdminContext/AdminContext";
import { delete_Event_Mutation } from "../../../../Component/graphql/Mutation";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function AEvents() {
  const [isCatefory, setIsCategory] = useState("");
  const [isSearch, setIsSearch] = useState("");
  const navigate = useNavigate();
  const { setUpdateId } = useEditContext();

  const {
    data,
    loading,
    refetch: refetchEvents,
  } = useQuery<Get_EVENTS_TYPE>(GET_EVENTS_QUERY, {
    variables: {
      category: isCatefory === "All" ? "" : isCatefory,
      search: isSearch === "" ? null : isSearch,
    },
  });
  const [deleteEventM] = useMutation(delete_Event_Mutation, {
    refetchQueries: [
      {
        query: GET_EVENTS_QUERY,
      },
    ],
  });

  useEffect(() => {}, [data]);

  const res = data?.getEvents || [];

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  const handleEventUpdate = (idx: string) => {
    setUpdateId(idx);
    navigate("/admin/createevent");
  };

  const handleEventView = (idx: string) => {
    setUpdateId(idx);
    navigate(`/admin/viewevent/${idx}`);
  };

  const handleDeleteEvent = async (idx: string) => {
    const res = await deleteEventM({
      variables: {
        eventId: idx,
      },
    });
    await refetchEvents();
    if (res) {
      toast("Event delete successfully", {
        position: "top-right",
        type: "success",
      });
    }
  };

  function debounce(fn: any, delay: number) {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return function (this: any, ...args: any[]) {
      if (timerId !== undefined) clearTimeout(timerId);
      timerId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }

  function callback(text: string) {
    setIsSearch(text);
  }
  const handledebounce = debounce(callback, 500);

  function handleDebounceSearch(e: React.ChangeEvent<HTMLInputElement>) {
    handledebounce(e.target.value);
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h3 className={styles.pageTitle}>All Events</h3>
          <button
            className={styles.createBtn}
            onClick={() => navigate("/admin/createevent")}
          >
            <IoMdAdd />
            Create Event
          </button>
        </div>

        <div className={styles.filterBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>
              <IoSearch />
            </span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search events..."
              onChange={handleDebounceSearch}
            />
          </div>
          <select
            className={styles.filterSelect}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setIsCategory(e.target.value)
            }
          >
            <option>All</option>
            <option>Sports</option>
            <option>Hackathon</option>
            <option>Technology</option>
            <option>AI</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Event Name</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {res.map((ele) => {
                return (
                  <tr key={ele.id}>
                    <td>
                      <img
                        src={ele.image}
                        alt="image"
                        className={styles.imgPlaceholder}
                      />
                    </td>
                    <td>
                      <div className={styles.eventName}>{ele.title}</div>
                      <div className={styles.eventDesc}>{ele.description}</div>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles.badgeHackathon}`}
                      >
                        {ele.category}
                      </span>
                    </td>
                    <td>
                      <div className={styles.dateMain}>
                        {formatDate(ele.eventStartDate)}
                      </div>
                      <div className={styles.dateTime}>
                        {formatDate(ele.eventEndDate)}
                      </div>
                    </td>
                    <td>
                      <span className={styles.location}>
                        {ele.Eventlocation}
                      </span>
                    </td>
                    <td>
                      <span className={styles.attendees}>
                        {ele.attendeeCount}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionView}`}
                          onClick={() => handleEventView(ele.id)}
                        >
                          <FaEyeSlash />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionEdit}`}
                          onClick={() => handleEventUpdate(ele.id)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                          onClick={() => handleDeleteEvent(ele.id)}
                        >
                          <RiDeleteBinFill />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
