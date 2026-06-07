import { NavLink } from "react-router-dom";
import styles from "./ loginsignup.module.css";
import { LuEye } from "react-icons/lu";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { OTP_LOGIN_MUTATION } from "../graphql/Mutation";
import type { Otp_Login_Res_Interface } from "../graphql/client";
import { useOTPPopup } from "../Context/PopupContext";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    toPhone: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  const [signInUser, { loading }] = useMutation<Otp_Login_Res_Interface>(
    OTP_LOGIN_MUTATION,
    {
      onCompleted: (data) => {
        console.log("data after login successfully : ", data);
      },
      onError: (error) => {
        console.log("data after login successfully : ", error);
      },
    },
  );
  const { openPopup } = useOTPPopup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const hadnleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.email) {
      toast("Emal is required! ", {
        position: "top-right",
        type: "info",
      });
      return;
    }
    if (!input.password.trim() || input.password.length < 6) {
      toast("Password required minimum of 6 digits ", {
        position: "top-right",
        type: "info",
      });
      return;
    }
    if (!input.toPhone.trim() || input.toPhone.length !== 10) {
      toast("Phone number required of 10-digits ", {
        position: "top-right",
        type: "info",
      });
      return;
    }
    try {
      const response = await signInUser({
        variables: {
          email: input.email,
          password: input.password,
          toPhone: "+91" + input.toPhone,
        },
      });
      if (!response) {
        toast("Invalid credentials! ", {
          position: "top-right",
          type: "warning",
        });
        return;
      }
      if (response.data?.sendOTPLogin?.success) {
        setInput({
          email: "",
          password: "",
          toPhone: "",
        });
        openPopup();
        toast(response.data?.sendOTPLogin?.otpMsg, {
          position: "top-right",
          type: "success",
          autoClose: 3000,
        });
      }
    } catch (error: any) {
      if (error.networkError) {
        toast("Network Error. Please check your connection.", {
          position: "top-right",
          type: "error",
        });
      } else {
        console.log("Error is : ", error);
        toast("Invalid Credentials, try again", {
          position: "top-right",
          type: "error",
        });
      }
    }
  };

  const handlePwVisibility = () => {
    setIsVisible(!isVisible);
  };
  if (loading) {
    return <p>Loading</p>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.signupCon}>
        <h3 className={styles.heading}>SignIn Account</h3>
        <br />
        <form action="" onSubmit={hadnleSubmit}>
          <div>
            <label htmlFor="email">Enter email</label>
            <input
              type="email"
              name="email"
              value={input.email}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={isVisible ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={handleChange}
                autoComplete="off"
              />
              {isVisible ? (
                <LuEye
                  className={styles.eyeIcon}
                  onClick={handlePwVisibility}
                />
              ) : (
                <FaEyeSlash
                  className={styles.eyeIcon}
                  onClick={handlePwVisibility}
                />
              )}
            </div>
          </div>
          <div>
            <label htmlFor="toPhone">Mobile Number</label>
            <input
              type="number"
              name="toPhone"
              value={input.toPhone}
              placeholder="Enter 10-digit phone number..."
              onChange={handleChange}
              autoComplete="off"
              maxLength={10}
            />
          </div>
          <button type="submit" className={styles.submitbtn}>
            Sent OTP
          </button>
        </form>
        <div className={styles.toggleText}>
          Don't have an account -
          <span>
            <NavLink to="/register">SignUp</NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}
