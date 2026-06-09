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
import { GET_EVENT_QUERY } from "../../../../Component/graphql/Query";
import { formatDate } from "../../../../Component/Context/conversion";

export default function ACreateEvent() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | string | null>(null);
  const [formInput, setFormInput] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    latitude: "",
    longitude: "",
    startDateTime: "",
    endDateTime: "",
  });
  const navigate = useNavigate();
  const { editId } = useEditContext();

  const [createEventMutation] =
    useMutation<Post_CreateEvent_Interface>(CreateEvent_Mutation);

  const { data, loading } = useQuery<GET_Event_Detail_Interface>(
    GET_EVENT_QUERY,
    {
      variables: {
        eventId: editId,
      },
    },
  );
  const [updateEventMutation] = useMutation(Update_Event_Mutation);
  const res = data?.getEvent;
  useEffect(() => {
    if (res) {
      setFormInput({
        title: res.title ?? "",
        description: res.description ?? "",
        category: res.category ?? "",
        location: res.Eventlocation ?? "",
        latitude: res.latitude ? res.latitude.toString() : "",
        longitude: res.longitude ? res.longitude.toString() : "",
        startDateTime: formatDate(res.eventStartDate) ?? "",
        endDateTime: formatDate(res.eventEndDate) ?? "",
      });
      setImagePreview(res.image);
    }
  }, [res]);

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

    let uploadedImageUrl = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("eventImg", imageFile);

      try {
        const { data } = await axios.post(
          "http://localhost:4003/upload/event-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        uploadedImageUrl = data?.imageUrl?.secure_url ?? "";
        setImagePreview(uploadedImageUrl);
      } catch (error) {
        console.error("Error during image upload:", error);
        toast("Image upload failed", { position: "top-right", type: "error" });
        return;
      }
    }

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
          toast("Event Updated successfully", {
            position: "top-right",
            type: "success",
          });
        }
        setImagePreview("");
      }
      if (!res && editId === null) {
        const result = await createEventMutation({
          variables: {
            title: formInput.title,
            description: formInput.description,
            category: formInput.category,
            eventlocation: formInput.location,
            eventStartDate: formInput.startDateTime,
            eventEndDate: formInput.endDateTime,
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
    } catch (error) {
      console.error("Error creating event:", error);
      toast("Failed to create event", { position: "top-right", type: "error" });
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
    setImagePreview("")
    return;
  };
  if (loading) return <p>Loading...</p>;
  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.backLink} onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </div>

        <div className={styles.card}>
          <h1 className={styles.formTitle}>Create New Event</h1>
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

              <div className={styles.loc}>
                <label className={styles.label}>Location</label>
                <input
                  className={styles.input}
                  readOnly
                  type="text"
                  name="location"
                  value={formInput.location}
                  onChange={handleFormChange}
                  placeholder="Click over map icon..."
                />
              </div>

              <div className={styles.row}>
                <div>
                  <label className={styles.label}>Latitude</label>
                  <input
                    name="latitude"
                    value={formInput.latitude}
                    readOnly
                    className={styles.input}
                    type="text"
                    placeholder="40.7829"
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className={styles.label}>Longitude</label>
                  <input
                    name="longitude"
                    value={formInput.longitude}
                    readOnly
                    className={styles.input}
                    type="text"
                    placeholder="-73.9654"
                    onChange={handleFormChange}
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
                    }}
                  />
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.btnCreate} type="submit">
                {res ? "Update Event" : "Create Event"}
              </button>
            </div>
          </form>
          <button className={styles.btnCancel} onClick={handleClearInput}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
