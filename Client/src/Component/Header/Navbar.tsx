import styles from "./Navbar.module.css";
import { MdOutlineSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
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
  const profileRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery<GET_CURRENT_USER_Interface>(GET_CURRENT_USER_QUERY);
  const client = useApolloClient();
  const navigate = useNavigate();
  const { closeChatPopup } = chatPopupContext();

  const res = data?.currentUser;

  const [logOutUser] = useMutation<boolean>(POST_LOGOUT_MUTATION, {
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
        console.error("Logout redirect cleanup aborted safely.");
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className={styles.bodyCon}>
      <div className={styles.container}>
        <div className={styles.con}>
          <NavLink className={`navlinkStyle ${styles.logo}`} to="/">
            <RiCalendarEventLine /> EventHub
          </NavLink>

          <div className={styles.rightCorner} ref={profileRef}>
            <Notifitcation />

            {res?.avatar ? (
              <img
                src={res?.avatar}
                alt="avatar"
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
    </div>
  );
}
