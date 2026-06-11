import styles from "./adminViewEvent.module.css";
import { IoReturnUpBack } from "react-icons/io5";
// import { FaRegEdit } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleAlt } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import type { GET_Event_Detail_Interface } from "../../../../Component/graphql/client";
import { useQuery } from "@apollo/client/react";
import { GET_EVENT_QUERY } from "../../../../Component/graphql/Query";
import { formatDate } from "../../../../Component/Context/conversion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ClipLoader } from "react-spinners";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function AdminViewEvent() {
  const { viewId } = useParams();
  const navigate = useNavigate();

  const { data, loading } = useQuery<GET_Event_Detail_Interface>(
    GET_EVENT_QUERY,
    { variables: { eventId: viewId } },
  );
  const res = data?.getEvent;

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }
  if (!res) return <p>No event found.</p>;

  return (
    // <div className={styles.root}>
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <button className={styles.backLink} onClick={() => navigate(-1)}>
          <IoReturnUpBack />
          Back to Events
        </button>
        <img className={styles.heroImage} src={res.image} />
        <div className={styles.card}>
          <div className={styles.topRow}>
            <span className={styles.badge}>{res.category}</span>
            {/* <button className={styles.editBtn}>
              <FaRegEdit /> Edit Event
            </button> */}
          </div>
          <h1 className={styles.eventTitle}>{res.title}</h1>
          <div className={styles.infoMapRow}>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <SlCalender />
                </span>
                <div>
                  <div className={styles.infoLabel}>Start-At</div>
                  <div className={styles.infoValue}>
                    {formatDate(res.eventStartDate)}
                  </div>
                </div>
                <div className={styles.enddate}>
                  <div className={styles.infoLabel}>End-To</div>
                  <div className={styles.infoValue}>
                    {formatDate(res.eventEndDate)}
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <FiMapPin />
                </span>
                <div>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue}>{res.Eventlocation}</div>
                  <div className={styles.infoSub}>
                    Coordinates: {res.latitude.toFixed(4)},{" "}
                    {res.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <MdPeopleAlt />
                </span>
                <div>
                  <div className={styles.infoLabel}>Attendees</div>
                  <div className={styles.infoValue}>
                    {res.attendeeCount} people registered
                  </div>
                </div>
              </div>
            </div>

            {/* <div className={styles.mapBox}> */}
            <MapContainer
              center={[res.latitude, res.longitude]}
              zoom={14}
              // style={{ width: "100%", height: "100%", borderRadius: "12px" }}
              scrollWheelZoom={false}
              className={styles.mapContainer}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[res.latitude, res.longitude]}>
                <Popup>{res.Eventlocation}</Popup>
              </Marker>
            </MapContainer>
            {/* </div> */}
          </div>

          <hr className={styles.divider} />
          <h2 className={styles.descTitle}>Description</h2>
          <p className={styles.descText}>{res.description}</p>
        </div>
      </div>
    </div>
  );
}
