/* import { useState, useRef } from "react";
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
  "Travel", "Food", "Art", "Gaming","Hackathon","Business"
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
      formData.append("avatarImg", imageFileRef.current);
      try {
        const { data } = await axios.post(
          "http://localhost:4003/upload/avatar-image",
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
                name="avatarImg"
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
                  {tag} +
                </button>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
} */

import { useState, useRef } from "react";
import styles from "./profile.module.css";
import { IoMailOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSaveAlt, MdCameraAlt } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import type {
  Update_Profile_Interface,
  Get_All_Interests_Interface,
  AddInterest_Interface,
} from "../graphql/client";
import {
  GET_USER_PROFILE_QUERY,
  GET_ALL_INTERESTS_QUERY,
} from "../graphql/Query"; // ← add query
import { useMutation, useQuery } from "@apollo/client/react";
import {
  UPDATE_PROFILE_MUTATION,
  ADD_INTEREST_MUTATION,
  REMOVE_INTEREST_MUTATION,
} from "../graphql/Mutation"; // ← add mutations
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

export default function Profile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const { authUserData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);

  const { data: getProfileData} =
    useQuery<Update_Profile_Interface>(GET_USER_PROFILE_QUERY, {
      variables: { userId: authUserData?.id },
    });

  const { data: allInterestsData } = useQuery<Get_All_Interests_Interface>(
    GET_ALL_INTERESTS_QUERY,
  );

  const getUserProfileRes = getProfileData?.editUserProfile;

  console.log("getProfile is : ",getUserProfileRes);
  

  const userInterestIds = new Set(
    getUserProfileRes?.interests?.map((i) => String(i.interestId)) ?? [],
  );

  const [updateProfile_Mutation] = useMutation<Update_Profile_Interface>(
    UPDATE_PROFILE_MUTATION,
  );

  const [addInterest] = useMutation<AddInterest_Interface>(
    ADD_INTEREST_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_USER_PROFILE_QUERY,
          variables: { userId: authUserData?.id },
        },
      ],
    },
  );
  const [removeInterest] = useMutation<boolean>(REMOVE_INTEREST_MUTATION, {
    refetchQueries: [
      {
        query: GET_USER_PROFILE_QUERY,
        variables: { userId: authUserData?.id },
      },
    ],
  });

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      imageFileRef.current = files[0];
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleToggleEdit = () => {
    if (!isOpen) {
      setFirstname(authUserData?.firstname ?? "");
      setLastname(authUserData?.lastname ?? "");
      setEmail(authUserData?.email ?? "");
      setImagePreview("");
      imageFileRef.current = null;
    }
    setIsOpen((prev) => !prev);
  };

  const handleSaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    let avatarUrl: string | undefined;

    if (imageFileRef.current) {
      const formData = new FormData();
      formData.append("avatarImg", imageFileRef.current);
      try {
        const { data } = await axios.post(
          "http://localhost:4003/upload/avatar-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        avatarUrl = data?.imageUrl?.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        setUploading(false);
        return;
      }
    }

    try {
      await updateProfile_Mutation({
        variables: {
          firstname,
          lastname,
          email,
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      });
      setIsOpen(false);
      setImagePreview("");
    } catch (err) {
      console.error("Mutation error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleInterest = async (interestId: number) => {
    if (togglingId === interestId) return; // debounce double clicks
    setTogglingId(interestId);

    try {
      if (userInterestIds.has(String(interestId))) {
        await removeInterest({
          variables: { interestId: String(interestId) },
        });
      } else {
        await addInterest({
          variables: { interestId: String(interestId) },
        });
      }
    } catch (err) {
      console.error("Interest toggle error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  console.log("iamgepreview : ", imagePreview);

  const displayAvatar = imagePreview
    ? getUserProfileRes?.avatar
    : authUserData?.avatar;
  // const displayAvatar = imagePreview || getUserProfileRes?.avatar;

  return (
    <div className="bodyCon">
      <div className={`container ${styles.profileCon}`}>
        <div className={styles.card}>
          <button className={styles.cancelBtn} onClick={handleToggleEdit}>
            <FaEdit />
            {isOpen ? "Cancel" : "Edit Profile"}
          </button>

          {/* ── Header ── */}
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
                onClick={() => isOpen && fileInputRef.current?.click()}
                style={{ cursor: isOpen ? "pointer" : "default" }}
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
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
              {isOpen && (
                <div
                  className={styles.cameraOverlay}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <MdCameraAlt size={16} />
                </div>
              )}
            </div>

            <div className={styles.headerInfo}>
              <h2 className={styles.headerName}>
                {(authUserData?.firstname ?? "").toUpperCase()}{" "}
                {(authUserData?.lastname ?? "").toUpperCase()}
              </h2>
              <div className={styles.headerMeta}>
                <span className={styles.metaItem}>
                  <IoMailOutline />
                  {authUserData?.email}
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

                <button
                  className={styles.saveBtn}
                  type="submit"
                  disabled={uploading}
                >
                  <MdOutlineSaveAlt />
                  {uploading ? "Saving..." : "Save Changes"}
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
              {allInterestsData?.getAllInterests.map((interest) => {
                const isActive = userInterestIds.has(String(interest.id));
                console.log(isActive);

                const isLoading = togglingId === Number(interest.id);

                return (
                  <button
                    key={interest.id}
                    className={`${styles.tag} ${isActive ? styles.tagActive : ""}`}
                    onClick={() => handleToggleInterest(Number(interest.id))}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "..."
                      : isActive
                        ? `${interest.name} ✓`
                        : `${interest.name} +`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
