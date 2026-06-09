import { FiSearch } from "react-icons/fi";
import styles from "./auser.module.css";
import { IoPersonCircle } from "react-icons/io5";

export default function AUsers() {
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
            <tr>
              <td>
                <div className={styles.avatarPlaceholder}>
                  <IoPersonCircle />
                </div>
              </td>
              <td>
                <span className={styles.userName}>John Doe</span>
              </td>
              <td>
                <span className={styles.cellText}>john.doe@example.com</span>
              </td>
              <td>
                <span className={styles.cellText}>+1 234 567 8900</span>
              </td>
              <td>
                <span className={styles.cellText}>2026-05-15</span>
              </td>
              <td>
                <span className={styles.eventsCount}>3</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
