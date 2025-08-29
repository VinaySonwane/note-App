import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // State for the resend countdown timer
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }

    // Countdown timer logic
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [email, navigate]);

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      setCanResend(false); // Disable button immediately
      const url = "http://localhost:5000/api/users/resend-otp";
      await axios.post(url, { email });
      toast.success("A new OTP has been sent.");
      setCountdown(60); // Reset timer

      // Restart the countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to resend OTP.");
      setCanResend(true); // Re-enable button on failure
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // ... (keep your existing handleSubmit logic)
    try {
      const url = "http://localhost:5000/api/users/verify-otp";
      const response = await axios.post(url, { email, otp });
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login successful! Welcome.");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Verification failed.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          An OTP has been sent to <strong>{email}</strong>. Please enter it
          below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              One-Time Password (OTP)
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              required
              minLength={6}
              maxLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Verify and Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={handleResendOtp}
            disabled={!canResend}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
