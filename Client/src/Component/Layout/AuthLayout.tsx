import { Outlet } from "react-router-dom";
import Popup from "../../Pages/Popup/Popup";


export default function AuthLayout() {
  return (
    <>
      <Outlet />
      <Popup />
    </>
  );
}
