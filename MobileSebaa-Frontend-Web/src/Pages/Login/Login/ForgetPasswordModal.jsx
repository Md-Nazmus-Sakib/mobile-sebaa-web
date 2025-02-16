/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

const ForgetPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: Code & Password
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { axiosPublic } = useAxiosPublic();
  const emailRef = useRef(null);

  // Validate email format
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsValid(emailPattern.test(emailValue));

    setError(emailPattern.test(emailValue) ? "" : "Invalid email format");
  };

  // Handle sending verification code
  const handleSendCode = async () => {
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosPublic.post("/api/auth/forget-password", {
        email,
      });
      if (response.data.success) {
        Swal.fire(
          "Success!",
          "Verification code sent to your email.",
          "success"
        );
        setStep(2); // Move to Step 2 (Enter Code & New Password)
      } else {
        setError("Failed to send reset link. Try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  // Handle resetting password
  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      setError("Please enter both the verification code and new password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosPublic.post("/api/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      if (response.data.success) {
        Swal.fire("Success!", "Your password has been reset.", "success");
        onClose(); // Close modal after success
      } else {
        setError("Invalid code or request failed. Try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <dialog
          open={isOpen}
          className="modal modal-bottom sm:modal-middle shadow-lg"
        >
          <div className="modal-box">
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <>
                <h3 className="font-bold text-lg">Forgot Password?</h3>
                <p className="text-gray-600">
                  Enter your email to receive a reset link.
                </p>

                <input
                  id="logEmail1"
                  ref={emailRef}
                  type="email"
                  value={email}
                  className="input input-bordered w-full mt-2"
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  required
                />

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="modal-action flex justify-between mt-4">
                  <button
                    className="btn btn-outline btn-error"
                    type="button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    className={`btn btn-outline btn-primary ${
                      !isValid ? "btn-disabled" : ""
                    }`}
                    onClick={handleSendCode}
                    disabled={!isValid || loading}
                  >
                    {loading ? (
                      <>
                        Sending{" "}
                        <span className="loading loading-spinner text-info"></span>
                      </>
                    ) : (
                      "Next"
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Enter Code & New Password */}
            {step === 2 && (
              <>
                <h3 className="font-bold text-lg">Reset Your Password</h3>
                <p className="text-gray-600">
                  Enter the verification code sent to your email.
                </p>

                <input
                  type="text"
                  value={code}
                  className="input input-bordered w-full mt-2"
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  required
                />

                <p className="text-gray-600 mt-2">Enter your new password.</p>
                <input
                  type="password"
                  value={newPassword}
                  className="input input-bordered w-full mt-2"
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />

                {error && <p className="text-red-500 mt-2">{error}</p>}

                <div className="modal-action flex justify-between mt-4">
                  <button
                    className="btn btn-outline btn-error"
                    type="button"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className={`btn btn-outline btn-success ${
                      !code || !newPassword ? "btn-disabled" : ""
                    }`}
                    onClick={handleResetPassword}
                    disabled={!code || !newPassword || loading}
                  >
                    {loading ? (
                      <>
                        Resetting{" "}
                        <span className="loading loading-spinner text-info"></span>
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </dialog>
      </div>
    )
  );
};

export default ForgetPasswordModal;
