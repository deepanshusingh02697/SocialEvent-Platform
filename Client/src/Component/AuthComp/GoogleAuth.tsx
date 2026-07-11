import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@apollo/client/react";
import type { googleLogin_Interface } from "../graphql/client";
import { Google_LogIn_Mutation } from "../graphql/Mutation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function GoogleAuth() {
  const navigate = useNavigate();

  const [googleLoginMutation] = useMutation<googleLogin_Interface>(
    Google_LogIn_Mutation,
  );

  const GoogleLoginFunc = async (CredentialResponse: any) => {
    try {
      const response = await googleLoginMutation({
        variables: { idToken: CredentialResponse.credential },
      });
      if (response) {
        toast("Login with Google Successfully", {
          position: "top-right",
          theme: "colored",
          type: "success",
          autoClose: 3000,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("error in GoogleLogin : ", error);
    }
  };
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => GoogleLoginFunc(credentialResponse)}
      onError={() => {
        console.error("Login Failed");
      }}
      useOneTap
    />
  );
}
