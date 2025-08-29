import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import axios
import toast from "react-hot-toast"; // 1. Import toast
import GoogleAuthButton from "../components/GoogleAuthButton";
import HdLogo from "../components/HdLogo";
import baseUrl from "../config/baseURL";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const url = `${baseUrl}/api/users/register`;
      const userData = { name, dob, email };
      const response = await axios.post(url, userData);

      toast.success(response.data.message);

      // Navigate to the OTP page on success, passing the email
      navigate("/verify-otp", { state: { email: email } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Registration failed:", error.response.data.message);
        // 3. Replace alert with toast.error
        toast.error(error.response.data.message);
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="text-center md:text-left mb-8">
            <HdLogo />
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Sign up</h2>
            <p className="text-gray-600 mt-2">
              Sign up to enjoy the feature of HD
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Jonas Khanwald"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>

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
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get OTP
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
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-1/2">
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

export default SignupPage;
