import styles from "./Navbar.module.css";
import { MdOutlineSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import type { GET_CURRENT_USER_Interface } from "../graphql/client";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query";
import { POST_LOGOUT_MUTATION } from "../graphql/Mutation";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { chatPopupContext } from "../Context/ChatPopupContext";
import { RiCalendarEventLine } from "react-icons/ri";
import { useOTPPopup } from "../Context/PopupContext";
import Notifitcation from "../Notification/Notifitcation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { closePopup } = useOTPPopup();
  const { data } = useQuery<GET_CURRENT_USER_Interface>(GET_CURRENT_USER_QUERY);
  const client = useApolloClient();
  const navigate = useNavigate();
  const { closeChatPopup } = chatPopupContext();

  const res = data?.currentUser;

  const [logOutUser] = useMutation<Boolean>(POST_LOGOUT_MUTATION, {
    refetchQueries: [
      {
        query: GET_CURRENT_USER_QUERY,
      },
    ],
  });
  const handleLogout = async () => {
    try {
      await logOutUser();
      await client.clearStore();
      closePopup();
      closeChatPopup();
      navigate("/login");
      toast("Logged out successfully", {
        position: "top-right",
        type: "success",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Logout failed : ", error);
      if (error.name === "AbortError" || error.message?.includes("aborted")) {
        console.log("Logout redirect cleanup aborted safely.");
      } else {
        console.error("Logout failed : ", error);
      }
    }
    setIsOpen(false);
  };
  const handleProfileSection = () => {
    navigate("/profile");
    setIsOpen(false);
  };
  const handleJoiinEvent = () => {
    navigate("/joinedevent");
    setIsOpen(false);
  };
  return (
    <div className={styles.bodyCon}>
      <div className={styles.container}>
        <div className={styles.con}>
          <NavLink className={`navlinkStyle ${styles.logo}`} to="/">
            <RiCalendarEventLine /> EventHub
          </NavLink>

          <div className={styles.rightCorner}>
            <Notifitcation/>

            {res?.avatar ? (
              <img
                src={res?.avatar}
                alt="avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  padding: "0px",
                  border: "1px solid gray",
                }}
                onClick={() => setIsOpen(!isOpen)}
              />
            ) : (
              <div
                className={styles.profilelogo}
                onClick={() => setIsOpen(!isOpen)}
              >
                {res?.firstname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {isOpen && (
            <div className={styles.profilefilter}>
              <div
                className={styles.profileBlock}
                onClick={handleProfileSection}
              >
                <MdOutlineSettings />
                <span>Profile setting</span>
              </div>
              {data?.currentUser && (
                <>
                  <div
                    className={styles.profileBlock}
                    onClick={handleJoiinEvent}
                  >
                    <IoPeopleCircleOutline />
                    <span> Joined Events</span>
                  </div>
                  <div className={styles.profileBlock} onClick={handleLogout}>
                    <FiLogOut />
                    <span> Logout</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
