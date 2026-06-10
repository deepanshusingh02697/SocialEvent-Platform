import { FiSearch } from "react-icons/fi";
import styles from "./auser.module.css";
// import { IoPersonCircle } from "react-icons/io5";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_USERS_QUERY } from "../../../../Component/graphql/Query";
import type { GET_ADMIN_USERS_Interface } from "../../../../Component/graphql/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function AUsers() {
  const [isSearch, setIsSearch] = useState("");
  const navigate = useNavigate();
  const { data, loading } = useQuery<GET_ADMIN_USERS_Interface>(
    GET_ADMIN_USERS_QUERY,
    {
      variables: {
        search: isSearch,
      },
    },
  );

  const res = data?.adminGetUsers || [];
  console.log("the res in admin Users is : ", res);
  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }
  if (!res.length) {
    return (
      <>
        <div className="loading">
          <div>
            <p>No Event found</p>
            <button
              style={{ padding: "10px 15px" }}
              onClick={() => navigate("/admin/users")}
            >
              Back
            </button>
          </div>
        </div>
      </>
    );
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIsSearch(e.target.value)
            }
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
              {/* <th>Events Joined</th> */}
            </tr>
          </thead>
          <tbody>
            {res.map((ele) => {
              return (
                <tr>
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
                    <span className={styles.cellText}>{ele.email}</span>
                  </td>
                  <td>
                    <span className={styles.cellText}>{ele.phone}</span>
                  </td>
                  <td>
                    <span className={styles.cellText}>
                      {new Date(Number(ele.createdAt)).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </td>
                  {/* <td>
                    <span className={styles.eventsCount}>3</span>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
