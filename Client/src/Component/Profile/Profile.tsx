import { useState, useRef } from "react";
import styles from "./profile.module.css";
import { IoMailOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSaveAlt, MdCameraAlt } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import type {
  GET_User_Profile_Interface,
  Update_Profile_Interface,
} from "../graphql/client";
import { GET_USER_PROFILE_QUERY } from "../graphql/Query";
import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_PROFILE_MUTATION } from "../graphql/Mutation";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
 
const ALL_INTERESTS = [
  "Sports", "Technology", "AI", "Music",
  "Travel", "Food", "Art", "Gaming",
];
 
export default function Profile() {
  const [bio, setBio] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [islatitude, setIsLatitude] = useState("");
  const [islongitude, setIsLongitude] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");
 
  const { authUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);
  const curUserData = authUserData;
 
  const [updateProfile_Mutation] =
    useMutation<Update_Profile_Interface>(UPDATE_PROFILE_MUTATION);
 
  const { data: getProfileData } = useQuery<GET_User_Profile_Interface>(
    GET_USER_PROFILE_QUERY,
    { variables: { userId: curUserData?.id } }
  );
 
  const getUserProfileRes = getProfileData?.getUserProfile;
 
  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      imageFileRef.current = files[0];
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };
 
  const handleUpdateProfile = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setBio(getUserProfileRes?.bio ?? "");
      setFirstname(curUserData?.firstname ?? "");
      setLastname(curUserData?.lastname ?? "");
      setEmail(curUserData?.email ?? "");
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsLatitude(latitude.toFixed(5));
          setIsLongitude(longitude.toFixed(5));
        },
        (error) => console.log(error.message)
      );
    }
  };
 
  const handleSaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    let uploadedImageUrl = imagePreview;
 
    if (imageFileRef.current) {
      const formData = new FormData();
      formData.append("userImg", imageFileRef.current);
      try {
        const { data } = await axios.post(
          "http://localhost:4003/upload/user-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        uploadedImageUrl = data?.imageUrl?.secure_url ?? imagePreview;
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
 
    const res = await updateProfile_Mutation({
      variables: {
        latitude: parseFloat(islatitude) || null,
        longitude: parseFloat(islongitude) || null,
        bio,
        profilePic: uploadedImageUrl,
        firstname,
        lastname,
        email,
      },
    });
    console.log("profile update res:", res);
  };
 
  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.card}>
 
          <button className={styles.cancelBtn} onClick={handleUpdateProfile}>
            <FaEdit />
            {isOpen ? "Cancel" : "Update"}
          </button>
 
          <div className={styles.header}>
            <div className={styles.avatarWrap}>
              <input
                type="file"
                name="userImg"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleChangeProfile}
                style={{ display: "none" }}
              />
              <div
                className={styles.avatarFallback}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview || getUserProfileRes?.profilePic ? (
                  <img
                    src={imagePreview || getUserProfileRes?.profilePic}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <MdCameraAlt size={28} />
                )}
              </div>
            </div>
 
            <div className={styles.headerInfo}>
              <h2 className={styles.headerName}>
                {(curUserData?.firstname ?? "").toUpperCase()}{" "}
                {(curUserData?.lastname ?? "").toUpperCase()}
              </h2>
              <div className={styles.headerMeta}>
                <span className={styles.metaItem}>
                  <IoMailOutline />
                  {curUserData?.email}
                </span>
              </div>
            </div>
          </div>
 
          <hr className={styles.divider} />
 
          {isOpen && (
            <>
              <form className={styles.form} onSubmit={handleSaveSubmit}>
 
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>First Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={firstname}
                      placeholder="First name..."
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={lastname}
                      placeholder="Last name..."
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>
 
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    placeholder="Email address..."
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
 
                <div className={styles.field}>
                  <label className={styles.label}>Bio</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={bio}
                    placeholder="About yourself..."
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
 
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Latitude</label>
                    <input
                      className={styles.input}
                      type="text"
                      readOnly
                      value={getUserProfileRes?.latitude ?? islatitude}
                      placeholder="Auto-detected..."
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Longitude</label>
                    <input
                      className={styles.input}
                      type="text"
                      readOnly
                      value={getUserProfileRes?.longitude ?? islongitude}
                      placeholder="Auto-detected..."
                    />
                  </div>
                </div>
 
                <button className={styles.saveBtn} type="submit">
                  <MdOutlineSaveAlt />
                  Save Changes
                </button>
              </form>
 
              <hr className={styles.divider} style={{ margin: "8px 0 28px" }} />
            </>
          )}
 
          <div className={styles.interestsSection}>
            <div className={styles.sectionTitle}>
              <FaRegHeart />
              Interests
            </div>
            <div className={styles.tags}>
              {ALL_INTERESTS.map((tag) => (
                <button key={tag} className={styles.tag}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}