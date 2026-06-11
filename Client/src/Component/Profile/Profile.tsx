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
  GET_CURRENT_USER_Interface,
} from "../graphql/client";
import {
  GET_ALL_INTERESTS_QUERY,
  GET_CURRENT_USER_QUERY,
} from "../graphql/Query";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  UPDATE_PROFILE_MUTATION,
  ADD_INTEREST_MUTATION,
  REMOVE_INTEREST_MUTATION,
} from "../graphql/Mutation";
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

  const { data: getProfileData } = useQuery<GET_CURRENT_USER_Interface>(
    GET_CURRENT_USER_QUERY,
    {
      variables: { userId: authUserData?.id },
    },
  );

  const { data: allInterestsData } = useQuery<Get_All_Interests_Interface>(
    GET_ALL_INTERESTS_QUERY,
  );

  const getUserProfileRes = getProfileData?.currentUser;

  console.log("getProfile of user interest is : ", getUserProfileRes);

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
          query: GET_CURRENT_USER_QUERY,
          variables: { userId: authUserData?.id },
        },
      ],
    },
  );
  const [removeInterest] = useMutation<boolean>(REMOVE_INTEREST_MUTATION, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER_QUERY,
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
              {/* {isOpen && ( */}
              <div
                className={styles.cameraOverlay}
                onClick={() => fileInputRef.current?.click()}
              >
                <MdCameraAlt size={16} />
              </div>
              {/* )} */}
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

          {/* {isOpen && ( */}
          <form className={styles.form} onSubmit={handleSaveSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>First Name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={firstname}
                  placeholder={authUserData?.firstname.toUpperCase()}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={lastname}
                  placeholder={authUserData?.lastname.toUpperCase()}
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
                placeholder={authUserData?.email}
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
          {/* )} */}

          <div className={styles.interestsSection}>
            <div className={styles.sectionTitle}>
              <FaRegHeart />
              Interests
            </div>
            <div className={styles.tags}>
              {allInterestsData?.getAllInterests.map((interest) => {
                const isActive = userInterestIds.has(String(interest.id));
                console.log("user interest is : ", isActive);

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
