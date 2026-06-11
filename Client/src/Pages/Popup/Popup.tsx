import {useRef, useState } from "react";
import {useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOTPPopup } from "../../Component/Context/PopupContext";
import { VERIFY_OTP_MUTATION } from "../../Component/graphql/Mutation";
import type { verifyOtpType } from "../../Component/graphql/client";
import styles from "./popup.module.css";
import { GET_CURRENT_USER_QUERY } from "../../Component/graphql/Query";

export default function Popup() {
  const { isOpen } = useOTPPopup();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [verifyOTP] = useMutation<verifyOtpType>(VERIFY_OTP_MUTATION,{
    refetchQueries:[{
      query:GET_CURRENT_USER_QUERY
    }]
  });

  if (!isOpen) return null;
  console.log("is open value from Popup.tsx ; ", isOpen);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");

    const digits = pastedText.slice(0, 6).split("");
    const newOTP = [...otp];
    digits.forEach((digit: string, i: number) => {
      newOTP[i] = digit;
      if (inputs.current[i]) {
        inputs.current[i].value = digit;
      }
    });
    setOtp(newOTP);
  };
  const handleChange = (val: string, idx: number) => {
    const updated = [...otp];
    updated[idx] = val.slice(-1); //only last char
    setOtp(updated);
    if (val && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const submitOTP = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stringOTP = otp.join("");
    const response = await verifyOTP({
      variables: {
        code: stringOTP,
      },
    });
    if (!response) {
      toast("Not verified, login again  ", {
        position: "top-right",
        type: "warning",
      });
      return;
    }
    const res = response?.data?.verifyOTP;
    try {
      if (res?.success) {
      toast(res?.message, {
        position: "top-right",
        type: "success",
        theme: "colored",
      });
      navigate("/");
    }/*  else {
      toast("Do login correctly ", {
        position: "top-right",
        type: "warning",
        theme: "colored",
      });
      navigate("/login");
    } */
    } catch (err) {
      const error = err as Error
      toast(error.message, {
        position: "top-right",
        type: "warning",
        theme: "colored",
      });
      navigate("/login")
    }
  };

  return (
    <>
      <div className={styles.popupCon}>
        <div className={styles.popup}>
          <h2>OTP Popup</h2>
          <form onSubmit={submitOTP} className={styles.otpCon}>
            <div onPaste={handlePaste} className={styles.boxes}>
              {otp.map((digit, i) => {
                return (
                  <input
                    key={i}
                    value={digit}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }} //auto paste
                    onChange={(e) => handleChange(e.target.value, i)} //if user fill
                    maxLength={1}
                  />
                );
              })}
            </div>
            <div className={styles.submitOTP}>
              <button type="submit">Submit OTP</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
