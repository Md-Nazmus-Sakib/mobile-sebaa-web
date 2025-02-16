/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import HelmetComponent from "../../../Hooks/HelmetComponent";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import ForgetPasswordModal from "./ForgetPasswordModal";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { axiosPublic } = useAxiosPublic();
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);

  const handelSignIn = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const loginInfo = { email, password };
    setError("");
    try {
      const res = await axiosPublic.post("/api/auth/login", loginInfo);

      if (res.data.success) {
        const { token } = res.data.data;

        // Store user info and token

        localStorage.setItem("token", token);
        form.reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Log in Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");

        return; // Stop further execution
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";

      if (
        errorMessage === "User is not verified. Please verify your account."
      ) {
        navigate(`/verification?email=${encodeURIComponent(email)}`);
        return; // Stop further execution
      }

      setError(errorMessage);
    }
  };

  //Forget Password

  //==============================================================================
  return (
    <div className="hero min-h-screen bg-base-200">
      <HelmetComponent
        title="Login | Access Your MobileSebaa Account"
        description="Log in to your MobileSebaa account to track your repairs, manage orders, and get exclusive offers. Secure and hassle-free access."
      ></HelmetComponent>

      <div className="card w-full sm:w-2/3 md:w-1/2 sm:p-10 pb-8 shadow-2xl bg-base-100">
        <h1 className="text-5xl font-bold">Login now!</h1>
        <form onSubmit={handelSignIn} className="card-body">
          <div className="form-control">
            <label className="label" htmlFor="logEmail1">
              <span className="label-text">Email</span>
            </label>
            <input
              id="logEmail1"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="email"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="logPass">
              <span className="label-text">Password</span>
            </label>
            <input
              id="logPass"
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered"
              required
            />
            <p className="label">
              <a
                onClick={() => setForgotModalOpen(true)}
                className="label-text-alt link link-hover text-lg mt-6"
              >
                Forgot password?
              </a>
            </p>
          </div>
          {error && (
            <div className="label">
              <p className="text-red-500 rounded-md font-bold bg-white p-2">
                {error}
              </p>
            </div>
          )}

          <div className="form-control mt-6">
            <button className="btn btn-primary">Login</button>
          </div>
        </form>
        <div className="card-body py-0">
          <p>
            Don &apos;t have an account?{" "}
            <span className="font-semibold text-black hover:text-blue-500 transition-all duration-200">
              <Link to={"/register"}>Sign up</Link>
            </span>{" "}
          </p>
        </div>
      </div>

      {/* modal dialog */}
      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <ForgetPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setForgotModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Login;
