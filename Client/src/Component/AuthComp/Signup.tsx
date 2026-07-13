import { NavLink, useNavigate } from "react-router-dom";
import styles from "./ loginsignup.module.css";
import { LuEye } from "react-icons/lu";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_CURRENT_USER_QUERY } from "../graphql/Query.js";
import { SIGNUP_MUTATION } from "../graphql/Mutation.js";
import GoogleAuth from "./GoogleAuth";
import { ClipLoader } from "react-spinners";
import type { SignupResponseData } from "../graphql/client.js";


export default function Signup() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isVisible, setIsVisible] = useState(false);

  // const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  //Apollo hook setUp
  const [signUpUser, { loading }] = useMutation<SignupResponseData>(
    SIGNUP_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_CURRENT_USER_QUERY,
        },
      ],
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handelSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !input.firstname ||
      !input.lastname ||
      !input.email ||
      !input.password ||
      !input.confirmPassword
    ) {
      toast("All fields are required", {
        position: "top-right",
        type: "info",
      });
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast("Password didnot match", {
        position: "top-right",
        type: "warning",
      });
      return;
    }

    try {
      const response = await signUpUser({
        variables: {
          firstname: input.firstname,
          lastname: input.lastname,
          email: input.email,
          password: input.password,
        },
      });
      if (!response) {
        toast("Invalid credentials! ", {
          position: "top-right",
          type: "warning",
        });
        return;
      }
      if (response.data?.signUp?.user) {
        setInput({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast("Account created successfully!", {
          position: "top-right",
          type: "success",
          theme: "colored",
        });
        navigate("/login");
      }
    } catch (error: any) {
      if (error.networkError) {
        toast("Network Error. Please check your connection.", {
          position: "top-right",
          type: "warning",
        });
      } else {
        const err = error as Error
        toast(err.message, {
          position: "top-right",
          type: "warning",
        });
      }
    }
  };
  const handlePwVisibility = () => {
    setIsVisible(!isVisible);
  };

     if (loading) {
    return (
      <div className="loadingOverlay">
        <ClipLoader color="#6c21c8" size={48} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapGoogleLoginCon}>
        <div className={styles.gline}>
          <span className={styles.line}></span>
          <GoogleAuth></GoogleAuth>
          <span className={styles.line}></span>
        </div>
        <div className={styles.signupCon}>
          <h3 className={styles.heading}>Create Account</h3>
          <br />
          <form method="post" onSubmit={handelSubmit}>
            <div>
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                name="firstname"
                value={input.firstname}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={input.lastname}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
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
              {/* Added container style here */}
              <div className={styles.passwordInputWrapper}>
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {/* Added icon style here */}
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
              <label htmlFor="password">Confirm Password</label>
              {/* Added container style here */}
              <div className={styles.passwordInputWrapper}>
                <input
                  type={isVisible ? "text" : "password"}
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {/* Added icon style here */}
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
            {/* {errorMsg && <div className={styles.error}>{errorMsg}</div>} */}

            <button type="submit" className={styles.submitbtn}>
              Submit
            </button>
          </form>
          {/* Added footer text style here */}
          <div className={styles.toggleText}>
            Have an account -
            <span>
              <NavLink to="/login">Login</NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
