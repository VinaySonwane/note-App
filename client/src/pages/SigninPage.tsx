import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";
import HdLogo from "../components/HdLogo";

const SigninPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  // 1. Add state for the "Keep me logged in" checkbox
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const url = "http://localhost:5000/api/users/verify-otp"; // Use the verify-otp endpoint for login
      const response = await axios.post(url, { email, otp });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Login failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // 2. Add the "Resend OTP" handler function
  const handleResendOtp = async () => {
    // First, check if an email has been entered
    if (!email) {
      return toast.error("Please enter your email first.");
    }

    try {
      const url = "http://localhost:5000/api/users/resend-otp";
      await axios.post(url, { email });

      // On success, show this success toast
      toast.success("A new OTP has been sent to your email.");
    } catch (error) {
      // If the API call fails, show this error toast
      toast.error(
        "Failed to resend OTP. Please check the email and try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="text-center md:text-left mb-8">
            <HdLogo />
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Sign in</h2>
            <p className="text-gray-600 mt-2">
              Please login to continue to your account.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="jonas.kahnwald@gmail.com"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              {/* 3. Update the OTP label and add the resend button */}
              <div className="flex justify-between items-center">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Resend OTP
                </button>
              </div>
              <input
                type="text"
                id="otp"
                placeholder="Enter your OTP"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            {/* 4. Add the "Keep me logged in" checkbox */}
            <div className="flex items-center">
              <input
                id="keep-logged-in"
                name="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="keep-logged-in"
                className="ml-2 block text-sm text-gray-900"
              >
                Keep me logged in
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleAuthButton />

          <p className="mt-8 text-center text-sm text-gray-600">
            Need an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1-2">
          <img
            className="object-cover w-full h-full"
            src="https://placehold.co/600x800/000000/FFFFFF?text=NoteApp"
            alt="Decorative"
          />
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
