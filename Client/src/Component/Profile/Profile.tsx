// import { useState } from "react";
// import styles from "./profile.module.css";
// import { IoMailOutline } from "react-icons/io5";
// import { FaEdit } from "react-icons/fa";
// // import { FaRegHeart } from "react-icons/fa";
// import { MdOutlineSaveAlt } from "react-icons/md";

// /* const ALL_INTERESTS = [
//   "Sports",
//   "Technology",
//   "AI",
//   "Music",
//   "Travel",
//   "Food",
//   "Art",
//   "Gaming",
// ]; */

// export default function Profile() {
//   const [input, setInput] = useState({
//     userbio: "",
//     latitude: "",
//     longitude: "",
//     userImg: "",
//   });
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   /*   const [interests, setInterests] = useState<string[]>(
//     initialData?.interests ?? ["Sports", "Technology", "AI"],
//   );

//   const toggleInterest = (tag: string) => {
//     setInterests((prev) =>
//       prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
//     );
//   }; */
//   const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setInput((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleSaveSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(input);
//   };
//   return (
//     <div className="bodyCon">
//       <div className="container">
//         <div className={styles.card}>
//           <button
//             className={styles.cancelBtn}
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             <FaEdit />
//             {isOpen ? "Cancel" : "Update"}
//           </button>
//           <div className={styles.header}>
//             <div className={styles.avatarWrap}>
//               <div className={styles.avatarFallback}>
//                 <input type="file" name="userImg" onChange={handleChangeProfile}/>
//               </div>
//             </div>
//             <div className={styles.headerInfo}>
//               <h2 className={styles.headerName}>{}</h2>
//               <div className={styles.headerMeta}>
//                 <span className={styles.metaItem}>
//                   <IoMailOutline />
//                   {}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className={styles.divider} />

//           {/* Form */}
//           {isOpen && (
//             <>
//               <form className={styles.form} onSubmit={handleSaveSubmit}>
//                 <div className={styles.field}>
//                   <label className={styles.label}>Bio Link</label>
//                   <input
//                     className={styles.input}
//                     type="text"
//                     value={input.userbio}
//                     placeholder="bio link..."
//                     name="userbio"
//                     onChange={handleChangeProfile}
//                   />
//                 </div>
//                 <div className={styles.field}>
//                   <label className={styles.label}>latitude</label>
//                   <input
//                     className={styles.input}
//                     type="text"
//                     name="latitude"
//                     value={input.latitude}
//                     placeholder="..."
//                     onChange={handleChangeProfile}
//                   />
//                 </div>
//                 <div className={styles.field}>
//                   <label className={styles.label}>longitude</label>
//                   <input
//                     className={styles.input}
//                     type="text"
//                     name="longitude"
//                     value={input.longitude}
//                     placeholder="..."
//                     onChange={handleChangeProfile}
//                   />
//                 </div>
//                 <button className={styles.saveBtn} type="submit">
//                   <MdOutlineSaveAlt />
//                   Save Changes
//                 </button>
//               </form>

//               <div className={styles.divider} style={{ margin: "28px 0" }} />
//             </>
//           )}

//           {/* <div className={styles.interestsSection}>
//             <div className={styles.sectionTitle}>
//               <FaRegHeart />
//               Interests
//             </div>
//             <div className={styles.tags}>
//               {ALL_INTERESTS.map((tag) => (
//                 <button
//                   key={tag}
//                   className={`${styles.tag} ${interests.includes(tag) ? styles.tagActive : ""}`}
//                   onClick={() => toggleInterest(tag)}
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import styles from "./profile.module.css";
import { IoMailOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { MdOutlineSaveAlt, MdCameraAlt } from "react-icons/md";
import type {
  GET_User_Profile_Interface,
  Update_Profile_Interface,
} from "../graphql/client";
import {
  GET_USER_PROFILE_QUERY,
} from "../graphql/Query";
import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_PROFILE_MUTATION } from "../graphql/Mutation";
import { FaRegHeart } from "react-icons/fa";
import JoinEvent from "./JoinEvent";
import { useAuth } from "../Context/AuthContext";


export default function Profile() {
  const [bio, setBio] = useState("");
  const [islatitude, setIsLatitude] = useState("");
  const [islongitude, setIsLongitude] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [imagePreview, setImagePreview] = useState<string>("");

  const {authUserData} = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<File | null>(null);


  const curUserData = authUserData;

  const [updateProfile_Mutation] = useMutation<Update_Profile_Interface>(
    UPDATE_PROFILE_MUTATION,
  );

  const { data: getProfileData } = useQuery<GET_User_Profile_Interface>(
    GET_USER_PROFILE_QUERY,
    {
      variables: {
        userId: curUserData?.id,
      },
    },
  );
  const ALL_INTERESTS = [
  "Sports",
  "Technology",
  "AI",
  "Music",
  "Travel",
  "Food",
  "Art",
  "Gaming",
];

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      imageFileRef.current = files[0];
      setImagePreview(URL.createObjectURL(files[0]));
      return;
    }
  };

  const handleUpdateProfile = () => {
    setIsOpen(!isOpen);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position.coords);
          const { latitude, longitude } = position.coords;
          setIsLatitude(latitude.toFixed(5).toString());
          setIsLongitude(longitude.toFixed(5).toString());
        },
        (error) => {
          console.log(error.message);
        },
      );
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userbio", bio);
    formData.append("latitude", islatitude);
    formData.append("longitude", islongitude);

    if (imageFileRef.current) {
      formData.append("userImg", imageFileRef.current);
    }
    // console.log("Text inputs:", input);
    console.log("Image file:", imageFileRef.current);
    console.log("FormData entries:", [...formData.entries()]);

    const res = await updateProfile_Mutation({
      variables: {
        latitude: parseFloat(islatitude),
        longitude: parseFloat(islongitude),
        bio: bio,
        profilePic: imagePreview,
      },
    });
    console.log("res in user profile : ", res);
  };

  const getUserProfileRes = getProfileData?.getUserProfile;
  console.log("getUserProfileRes : ===> ", getUserProfileRes);



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
                style={{ cursor: "pointer", position: "relative" }}
              >
                {imagePreview ? (
                  <img
                    src={
                      getUserProfileRes?.profilePic !== null
                        ? getUserProfileRes?.profilePic
                        : imagePreview
                    }
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
                {curUserData?.firstname.toUpperCase() +
                  " " +
                  curUserData?.lastname.toUpperCase()}
              </h2>
              <div className={styles.headerMeta}>
                <span className={styles.metaItem}>
                  <IoMailOutline />
                  {curUserData?.email}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Form */}
          {isOpen && (
            <>
              <form className={styles.form} onSubmit={handleSaveSubmit}>
                <div className={styles.field}>
                  <label className={styles.label}>Bio Link</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={getUserProfileRes ? getUserProfileRes.bio : bio}
                    placeholder="About yourself..."
                    name="userbio"
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Latitude</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="latitude"
                    value={
                      getUserProfileRes
                        ? getUserProfileRes?.latitude
                        : islatitude
                    }
                    placeholder="..."
                    onChange={(e) => setIsLatitude(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Longitude</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="longitude"
                    value={
                      getUserProfileRes
                        ? getUserProfileRes?.longitude
                        : islongitude
                    }
                    placeholder="..."
                    onChange={(e) => setIsLongitude(e.target.value)}
                  />
                </div>
                <button className={styles.saveBtn} type="submit">
                  <MdOutlineSaveAlt />
                  Save Changes
                </button>
              </form>

              <div className={styles.divider} style={{ margin: "28px 0" }} />
            </>
          )}
        

          <div className={styles.interestsSection}>
            <div className={styles.sectionTitle}>
              <FaRegHeart />
              Interests
            </div>
            <div className={styles.tags}>
              {ALL_INTERESTS.map((tag) => (
                <button
                  key={tag}
                  className={styles.tag} 
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <JoinEvent />
         
      </div>
    </div>
  );
}
