import styles from "./adminViewEvent.module.css";
import { IoReturnUpBack } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";

export default function AdminViewEvent() {
  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <button className={styles.backLink}>
          <IoReturnUpBack />
          Back to Events
        </button>
        <img
          className={styles.heroImage}
          src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=1200&q=80"
          alt="Annual Marathon 2026"
        />
        <div className={styles.card}>
          <div className={styles.topRow}>
            <span className={styles.badge}>Sports</span>
            <button className={styles.editBtn}>
              <FaRegEdit /> Edit Event
            </button>
          </div>
          <h1 className={styles.eventTitle}>Annual Marathon 2026</h1>
          <div className={styles.infoMapRow}>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <SlCalender />
                </span>
                <div>
                  <div className={styles.infoLabel}>Date</div>
                  <div className={styles.infoValue}>2026-06-15</div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>🕐</span>
                <div>
                  <div className={styles.infoLabel}>Time</div>
                  <div className={styles.infoValue}>06:00 AM - 12:00 PM</div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <FiMapPin />
                </span>
                <div>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>Central Park, New York</div>
                  <div className={styles.infoSub}>
                    Coordinates: 40.7829, -73.9654
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <MdPeopleAlt />
                </span>
                <div>
                  <div className={styles.infoLabel}>Attendees</div>
                  <div className={styles.infoValue}>234 people registered</div>
                </div>
              </div>
            </div>
            <div className={styles.mapBox}>
              <span className={styles.mapIcon}>
                <FiMapPin />
              </span>
              <span className={styles.mapLabel}>Map View</span>
              <span className={styles.mapCoords}>
                Lat: 40.7829, Lng: -73.9654
              </span>
            </div>
          </div>

          <hr className={styles.divider} />

          <h2 className={styles.descTitle}>Description</h2>
          <p className={styles.descText}>
            Join us for the annual marathon event! This is a great opportunity
            to challenge yourself and connect with fellow runners. All skill
            levels welcome.
          </p>
        </div>
      </div>
    </div>
  );
}
