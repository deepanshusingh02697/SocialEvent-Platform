import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";
// import { MdLocationOn } from "react-icons/md";
import styles from "./eventDetail.module.css";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_EVENT_DETAILS_QUERY,
  GET_EVENTS_QUERY,
  GET_USER_JOIN_QUERY,
} from "../../Component/graphql/Query";
import type {
  GET_Event_Detail_Interface,
  GET_USER_JOIN_Interface,
  Post_Join_Event_Interface,
} from "../../Component/graphql/client";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../Component/Context/conversion";

import {
  JOIN_EVENT_MUTATION,
  Leave_EVENT_MUTATION,
} from "../../Component/graphql/Mutation";
import { toast } from "react-toastify";
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

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useQuery<GET_Event_Detail_Interface>(
    GET_EVENT_DETAILS_QUERY,
    {
      variables: {
        eventId: Number(eventId),
      },
    },
  );

  const [JoinEventMutaion] = useMutation<Post_Join_Event_Interface>(
    JOIN_EVENT_MUTATION,
    {
      refetchQueries: [
        { query: GET_EVENTS_QUERY },
        { query: GET_USER_JOIN_QUERY },
      ],
    },
  );
  const [leaveEvent] = useMutation<boolean>(Leave_EVENT_MUTATION, {
    refetchQueries: [
      { query: GET_EVENT_DETAILS_QUERY },
      { query: GET_EVENTS_QUERY },
      { query: GET_USER_JOIN_QUERY },
    ],
  });
  const { data: checkJoinEvent } =
    useQuery<GET_USER_JOIN_Interface>(GET_USER_JOIN_QUERY);

  const joinedEvensRes = checkJoinEvent?.userJoinedEvents;
  if (!joinedEvensRes) return;
  const isjoin = joinedEvensRes?.some((ele) => ele.id === eventId) ?? false;

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  const eventDetailData = data?.getEvent;
  if (!eventDetailData) {
    return;
  }

  const handleJoinEvent = async () => {
    try {
      const res = await JoinEventMutaion({
        variables: {
          eventId: Number(eventId),
        },
      });
      if (res?.data?.joinEvent) {
        toast("Event Join Successfully! ", {
          position: "top-right",
          type: "success",
        });
      }
    } catch (err) {
      const error = err as Error;
      if (error) {
        toast(error.message, {
          position: "top-right",
          type: "info",
        });
        return;
      }
    }
  };
  const handleLeaveEvent = async () => {
    try {
      await leaveEvent({
        variables: {
          eventId: Number(eventId),
        },
      });
      toast("Leave Event Successfully! ", {
        position: "top-right",
        type: "success",
      });
    } catch (err) {
      console.log("error is : ", err);
      const error = err as Error;
      if (error) {
        toast(error.message, {
          position: "top-right",
          type: "info",
        });
        return;
      }
    }
  };

  return (
    <>
      <div className="bodyCon">
        <div className={`container ${styles.eventDetailCon}`}>
          <button className={styles.back} onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back to Events
          </button>
          <div className={styles.wrapper}>
            <div className={styles.heroWrap}>
              <img
                src={eventDetailData?.image}
                alt="eventDetails"
                className={styles.heroImg}
              />
            </div>
            <div className={styles.topRow}>
              <span className={styles.category}>
                {eventDetailData?.category}
              </span>
              {isjoin ? (
                <button className={styles.joinBtn} onClick={handleLeaveEvent}>
                  Leave Event
                </button>
              ) : (
                <button className={styles.joinBtn} onClick={handleJoinEvent}>
                  Join Event
                </button>
              )}
            </div>

            <h1 className={styles.title}>{eventDetailData?.title}</h1>

            <div className={styles.infoRow}>
              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <FaCalendarAlt className="detailIcon" />
                  <div className={styles.eventDates}>
                    <div>
                      <p className={styles.detailLabel}>Start-From</p>
                      <p className={styles.detailValue}>
                        {formatDate(eventDetailData?.eventStartDate)}
                      </p>
                    </div>
                    <div className={styles.endDate}>
                      <p className={styles.detailLabel}>End-To</p>
                      <p className={styles.detailValue}>
                        {formatDate(eventDetailData?.eventEndDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <FaMapMarkerAlt className="detailIcon" />
                  <div>
                    <p className={styles.detailLabel}>Location</p>
                    <p className={styles.detailValue}>
                      {eventDetailData?.Eventlocation}
                    </p>
                    <p className={styles.detailSub}>
                      {eventDetailData?.distance} km away
                    </p>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <FaUsers className="detailIcon" />
                  <div>
                    <p className={styles.detailLabel}>Attendees</p>
                    <p className={styles.detailValue}>
                      {eventDetailData?.attendeeCount} people attending
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className={styles.mapBox}>
                <MdLocationOn className="detailIcon" />
                <p className={styles.mapLabel}>Map View</p>
                <p className={styles.mapCoords}>Lat: 40.7829, Lng: -73.9654</p>
              </div> */}
              <MapContainer
                center={[eventDetailData.latitude, eventDetailData.longitude]}
                zoom={14}
                style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    eventDetailData.latitude,
                    eventDetailData.longitude,
                  ]}
                >
                  <Popup>{eventDetailData.Eventlocation}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className={styles.divider} />

            <div className={styles.about}>
              <h3 className={styles.aboutTitle}>About this event</h3>
              <p className={styles.aboutText}>{eventDetailData?.description}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
