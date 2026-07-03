import { useEffect, useState } from "react";
import styles from "./acreate_event.module.css";
import { LuMapPin } from "react-icons/lu";
import axios from "axios";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateEvent_Mutation,
  Update_Event_Mutation,
} from "../../../../Component/graphql/Mutation";
import type {
  GET_Event_Detail_Interface,
  Post_CreateEvent_Interface,
} from "../../../../Component/graphql/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEditContext } from "../../../AdminContext/AdminContext";
import {
  GET_EVENT_QUERY,
  GET_EVENTS_QUERY,
} from "../../../../Component/graphql/Query";
import MapComponent from "../../MapComp/LocationMarker";
import { formatDate } from "../../../../Component/Context/conversion";
import { ClipLoader } from "react-spinners";

export default function ACreateEvent() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    category: "Sports",
    location: "",
    latitude: "",
    longitude: "",
    startDateTime: "",
    endDateTime: "",
  });

  const navigate = useNavigate();

  const { editId, setUpdateId, ismaplatitude, ismaplongitude } =
    useEditContext();

  const [createEventMutation] = useMutation<Post_CreateEvent_Interface>(
    CreateEvent_Mutation,
    {
      refetchQueries: [
        {
          query: GET_EVENTS_QUERY,
        },
      ],
    },
  );
  const [updateEventMutation] = useMutation(Update_Event_Mutation);

  const { data, loading } = useQuery<GET_Event_Detail_Interface>(
    GET_EVENT_QUERY,
    {
      variables: { eventId: editId },
      skip: !editId,
    },
  );

  const res = data?.getEvent;

  //  fetch human-readable location from lat/longi using Nominatim website to show the address
  const fetchLocationName = async (lat: string, lng: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      const name =
        data?.display_name ??
        data?.address?.city ??
        data?.address?.town ??
        `${lat}, ${lng}`;
      setLocationName(name);
      console.log("the location name become : ",locationName);
      
      setFormInput((prev) => ({ ...prev, location: name }));
    } catch (err) {
      console.error("Reverse geocode failed:", err);
    }
  };

  // update lat/lng in formInput if coordinate of user change 
  useEffect(() => {
    if (ismaplatitude && ismaplongitude) {
      setFormInput((prev) => ({
        ...prev,
        latitude: ismaplatitude.toString(),
        longitude: ismaplongitude.toString(),
      }));
      fetchLocationName(ismaplatitude.toString(), ismaplongitude.toString());
    }
  }, [ismaplatitude, ismaplongitude]);


  useEffect(() => {
    if (res) {
      setFormInput({
        title: res.title ?? "",
        description: res.description ?? "",
        category: res.category ?? "Sports",
        location: res.Eventlocation ?? "",
        latitude: res.latitude ? res.latitude.toString() : "",
        longitude: res.longitude ? res.longitude.toString() : "",
        startDateTime: formatDate(res.eventStartDate),
        endDateTime: formatDate(res.eventEndDate),
      });
      setImagePreview(res.image ?? "");
    } else if (!editId) {
      setFormInput({
        title: "",
        description: "",
        category: "Sports",
        location: "",
        latitude: "",
        longitude: "",
        startDateTime: "",
        endDateTime: "",
      });
      setImagePreview("");
    }
  }, [res, editId]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setImageFile(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let uploadedImageUrl = imagePreview;

    if (imageFile) {
      const formData = new FormData();
      formData.append("eventImg", imageFile);
      try {
        const { data } = await axios.post(
          "http://localhost:4003/upload/event-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        uploadedImageUrl = data?.imageUrl?.secure_url ?? "";
        setImagePreview(uploadedImageUrl);
      } catch (error) {
        console.error("Image upload failed:", error);
        toast("Image upload failed", { position: "top-right", type: "error" });
        return;
      }
    }

    console.log();
    

    try {
      if (res && editId !== null) {
        const result = await updateEventMutation({
          variables: {
            eventId: editId,
            title: formInput.title,
            description: formInput.description,
            category: formInput.category,
            eventlocation: formInput.location,
            eventStartDate: formInput.startDateTime,
            eventEndDate: formInput.endDateTime,
            latitude: formInput.latitude
              ? parseFloat(formInput.latitude)
              : null,
            longitude: formInput.longitude
              ? parseFloat(formInput.longitude)
              : null,
            image: uploadedImageUrl,
          },
        });
        if (result.data) {
          toast("Event updated successfully", {
            position: "top-right",
            type: "success",
          });
          setUpdateId(null);
        }
      } else {
        const result = await createEventMutation({
          variables: {
            title: formInput.title,
            description: formInput.description,
            category: formInput.category,
            eventlocation: formInput.location,
            eventStartDate: formInput.startDateTime,
            eventEndDate: formInput.endDateTime,
            latitude: formInput.latitude
              ? parseFloat(formInput.latitude)
              : null,
            longitude: formInput.longitude
              ? parseFloat(formInput.longitude)
              : null,
            image: uploadedImageUrl,
          },
        });
        if (result.data) {
          toast("Event created successfully", {
            position: "top-right",
            type: "success",
          });
        }
      }

      setFormInput({
        title: "",
        description: "",
        category: "Sports",
        location: "",
        latitude: "",
        longitude: "",
        startDateTime: "",
        endDateTime: "",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Submit error:", err);
      const error = err as Error;
      toast(error.message, { position: "top-right", type: "error" });
    }
  };

  const handleClearInput = () => {
    setFormInput({
      title: "",
      description: "",
      category: "Sports",
      location: "",
      latitude: "",
      longitude: "",
      startDateTime: "",
      endDateTime: "",
    });
    setImagePreview("");
    setImageFile(null);
    setUpdateId(null);
  };
  const handlebackBtn = () => {
    handleClearInput();
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.backLink} onClick={handlebackBtn}>
          ← Back to Dashboard
        </div>

        <div className={styles.card}>
          <h1 className={styles.formTitle}>
            {res ? "Update Event" : "Create New Event"}
          </h1>

          <form onSubmit={handleFormSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Event Title</label>
              <input
                className={styles.input}
                type="text"
                name="title"
                value={formInput.title}
                onChange={handleFormChange}
                placeholder="Annual Tech Conference 2026"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                name="description"
                value={formInput.description}
                onChange={handleFormChange}
                placeholder="Describe your event in detail..."
              />
            </div>

            <div className={styles.row}>
              <div>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.select}
                  name="category"
                  value={formInput.category}
                  onChange={handleFormChange}
                >
                  <option value="Sports">Sports</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Technology">Technology</option>
                  <option value="AI">AI</option>
                  <option value="Music">Music</option>
                  <option value="Business">Business</option>
                  <option value="Food">Food</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Art">Art</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>
            </div>

            <div className={styles.mapSection}>
              <div className={styles.mapSectionTitle}>
                <span className={styles.mapPin}>
                  <LuMapPin />
                </span>
                Map Coordinates
              </div>

              <div
                style={{
                  marginBottom: 15,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <MapComponent />
              </div>

              {/* LOCATION — autofilled from reverse geocode  */}
              <div className={styles.loc}>
                <label className={styles.label}>Location</label>
                <input
                  className={styles.input}
                  readOnly
                  type="text"
                  name="location"
                  value={formInput.location}
                  placeholder="Click on map to set location..."
                />
              </div>

              {/* LAT / LONG — autofill from map click using api*/}
              <div className={styles.row}>
                <div>
                  <label className={styles.label}>Latitude</label>
                  <input
                    className={styles.input}
                    readOnly
                    type="text"
                    name="latitude"
                    value={formInput.latitude}
                    placeholder="40.7829"
                  />
                </div>
                <div>
                  <label className={styles.label}>Longitude</label>
                  <input
                    className={styles.input}
                    readOnly
                    type="text"
                    name="longitude"
                    value={formInput.longitude}
                    placeholder="-73.9654"
                  />
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <div>
                <label className={styles.label}>Start Date-Time</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  name="startDateTime"
                  value={formInput.startDateTime}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <label className={styles.label}>End Date-Time</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  name="endDateTime"
                  value={formInput.endDateTime}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Event Image (Optional)</label>
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  name="eventImg"
                  accept="image/*"
                  onChange={handleChangeProfile}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      marginTop: 12,
                      maxHeight: 160,
                      borderRadius: 8,
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCreate} type="submit">
                {res ? "Update Event" : "Create Event"}
              </button>
              <button
                className={styles.btnCancel}
                type="button"
                onClick={handleClearInput}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
