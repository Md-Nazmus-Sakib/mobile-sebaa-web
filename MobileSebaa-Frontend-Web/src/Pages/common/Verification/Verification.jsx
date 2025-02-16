import { useState } from "react";
import HelmetComponent from "../../../Hooks/HelmetComponent";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const Verification = () => {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const { axiosPublic } = useAxiosPublic();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleVerification = async (event) => {
    event.preventDefault();
    const form = event.target;
    const code = form.code.value;
    const verifyInfo = { email, code };

    setError("");
    setLoading(true);

    try {
      const res = await axiosPublic.post("/api/auth/verify-code", verifyInfo);
      if (res.data.success) {
        setLoading(false);
        form.reset();
        Swal.fire({
          title: "Verification Successful!",
          icon: "success",
        }).then(() => {
          navigate("/");
        });
      } else {
        throw new Error("Verification failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const handleResendVerification = async () => {
    setError("");
    if (!email) {
      setError("Invalid email. Please go back and try again.");
      return;
    }

    setResendLoading(true);
    try {
      const res = await axiosPublic.post("/api/auth/resend-code", { email });
      if (res.data.success) {
        setResendLoading(false);
        Swal.fire({
          title: "Code Sent To Your Email!",
          icon: "success",
        });
      } else {
        throw new Error("Failed to resend verification code.");
      }
    } catch (error) {
      setResendLoading(false);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <HelmetComponent
        title="Account Verification | Secure Your Access"
        description="Verify your account securely to access all features. Enter your verification code to complete the process and ensure your account's safety."
      ></HelmetComponent>

      <div className="card w-full sm:w-2/3 md:w-1/2 sm:p-10 pb-8 shadow-2xl bg-base-100">
        <h1 className="text-5xl font-bold">Verification Now!</h1>
        <form onSubmit={handleVerification} className="card-body">
          <div className="form-control">
            <label className="label" htmlFor="verificationCode">
              <span className="label-text">Verification Code</span>
            </label>
            <input
              id="verificationCode"
              type="text"
              name="code"
              placeholder="Enter Code"
              className="input input-bordered"
              required
            />
          </div>
          {error && (
            <div className="label">
              <p className="text-red-500 rounded-md font-bold bg-white p-2">
                {error}
              </p>
            </div>
          )}

          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  Verifying{" "}
                  <span className="loading loading-spinner text-secondary"></span>
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
        <div className="card-body py-0">
          <button
            className="btn btn-outline"
            onClick={handleResendVerification}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <>
                Resending{" "}
                <span className="loading loading-spinner text-secondary"></span>
              </>
            ) : (
              "Resend Code"
            )}
          </button>
        </div>
        <div className="card-body py-0 my-6">
          <Link to="/login">
            <button className="btn btn-error text-white w-full">
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verification;
