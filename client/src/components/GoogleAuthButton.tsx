import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const GoogleAuthButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const credential = credentialResponse.credential;
    if (!credential) {
      return toast.error("Google login failed. Please try again.");
    }

    try {
      // Send the Google credential to our backend
      const url = "http://localhost:5000/api/users/google-auth";
      const { data } = await axios.post(url, { credential });

      // Save our app's token and user data, then navigate
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful! Welcome.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to sign in with Google.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
      />
    </div>
  );
};

export default GoogleAuthButton;
