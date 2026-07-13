import { Outlet } from "react-router-dom";
import ANavbar from "../AdminComponent/Header/ANavbar";
import styles from "./adminlayout.module.css";

export default function AdminLayout() {
  return (
    <>
      <div className={styles.adminlayout}>
        <ANavbar />
        <Outlet />
      </div>
    </>
  );
}
