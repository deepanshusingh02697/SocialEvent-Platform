import { FiSearch } from "react-icons/fi";
import styles from "./auser.module.css";
// import { IoPersonCircle } from "react-icons/io5";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_USERS_QUERY } from "../../../../Component/graphql/Query";
import type { GET_ADMIN_USERS_Interface } from "../../../../Component/graphql/client";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function AUsers() {
  const [isSearch, setIsSearch] = useState("");
  const { data, loading } = useQuery<GET_ADMIN_USERS_Interface>(
    GET_ADMIN_USERS_QUERY,
    {
      variables: {
        search: isSearch,
      },
    },
  );

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  const res = data?.adminGetUsers || [];
  console.log("the res in admin Users is : ", res);

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
    <div className={styles.main}>
      <h1 className={styles.pageTitle}>Users Management</h1>
      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>
            <FiSearch />
          </span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search users..."
            value={isSearch}
            onChange={(e) => handleDebounceSearch(e)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Registered Date</th>
              <th>Events Joined</th>
            </tr>
          </thead>
          <tbody>
            {res.map((ele) => {
              return (
                <tr key={ele.id}>
                  <td>
                    <div className={styles.avatarPlaceholder}>
                      {/* <IoPersonCircle /> */}
                      <img src={ele.avatar} alt="" />
                    </div>
                  </td>
                  <td>
                    <span className={styles.userName}>
                      {ele.firstname + " " + ele.lastname}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.cellText} ${styles.email}`}>
                      {ele.email}
                    </span>
                  </td>
                  <td>
                    <span className={styles.cellText}>{ele.phone}</span>
                  </td>
                  <td>
                    <span className={styles.cellText}>
                      {new Date(Number(ele.createdAt)).toLocaleString(
                        "en-IN",
                        {
                          day:'2-digit',
                          month:"2-digit",
                          year:"2-digit",
                          hour:"2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={styles.eventsCount}>
                      {ele?.attendees?.reduce((accumulator, attendee) => {
                        return accumulator + (attendee?.eventId && 1);
                      }, 0)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
