import { useState } from "react";
import styles from "./anavbar.module.css";
import { MdOutlineEventAvailable, MdOutlineEvent } from "react-icons/md";
import { RiUserSharedFill } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { NavLink, useNavigate } from "react-router-dom";
import { POST_LOGOUT_MUTATION } from "../../../Component/graphql/Mutation";
import { GET_CURRENT_USER_QUERY } from "../../../Component/graphql/Query";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
 
export default function ANavbar() {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
 
  const [logOutUser] = useMutation<Boolean>(POST_LOGOUT_MUTATION, {
    refetchQueries: [{ query: GET_CURRENT_USER_QUERY }],
  });
 
  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login");
      await client.clearStore();
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
  };
 
  const closeMenu = () => setMenuOpen(false);
 
  return (
    <div>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.navBrand}>
          <MdOutlineEvent />
          EventHub Admin
        </NavLink>
 
        <div className={styles.navLinks}>
          <NavLink to="/admin">
            <button className={`${styles.navLink}`}>
              <MdOutlineEventAvailable />
              Events
            </button>
          </NavLink>
          <NavLink to="/admin/users">
            <button className={styles.navLink}>
              <RiUserSharedFill />
              Users
            </button>
          </NavLink>
          <button className={styles.navLogout} onClick={handleLogout}>
            <LuLogOut />
            Logout
          </button>
        </div>
 
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
        </button>
      </nav>
 
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/" onClick={closeMenu}>
            <button className={styles.mobileLink}>
              <MdOutlineEventAvailable />
              Events
            </button>
          </NavLink>
          <NavLink to="/users" onClick={closeMenu}>
            <button className={styles.mobileLink}>
              <RiUserSharedFill />
              Users
            </button>
          </NavLink>
          <button
            className={styles.mobileLogout}
            onClick={() => { closeMenu(); handleLogout(); }}
          >
            <LuLogOut />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}