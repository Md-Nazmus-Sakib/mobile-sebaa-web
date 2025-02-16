import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
// import { sendEmailVerification } from "firebase/auth";
import HelmetComponent from "../../../Hooks/HelmetComponent";

const Register = () => {
  const navigate = useNavigate();
  const { axiosPublic, loading } = useAxiosPublic();
  const [error, setError] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const password = form.password.value.trim();
    const country = form.country.value.trim();

    setError("");

    // Password validation
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      return setError("Password must contain at least one uppercase letter.");
    }
    if (!/[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/₹]/.test(password)) {
      return setError("Password must contain at least one special character.");
    }

    const userInfo = { name, email, phone, password, country };

    try {
      const res = await axiosPublic.post("/api/auth/signup", userInfo);
      console.log(res);

      if (res.data.success) {
        form.reset();
        Swal.fire({
          title: "Check Your Email to Verify!",
          icon: "question",
        });
        navigate(`/verification?email=${encodeURIComponent(email)}`);
        return; // Stop further execution
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      if (
        errorMessage === "User is not verified. Please verify your account."
      ) {
        navigate(`/verification?email=${encodeURIComponent(email)}`);
        return; // Stop further execution
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <HelmetComponent
        title="Sign Up | Join MobileSebaa for Easy Repairs"
        description="Create an account at MobileSebaa for quick repair bookings, order tracking, and special discounts. Sign up today for a seamless mobile repair experience!"
      ></HelmetComponent>

      <div className="card w-full sm:w-2/3 md:w-1/2 sm:p-10 pb-8 shadow-2xl bg-base-100">
        <h1 className="text-5xl font-bold">Register Now !</h1>
        <form onSubmit={handleRegister} className="card-body">
          <div className="form-control">
            <label className="label" htmlFor="regName">
              <span className="label-text">Name</span>
            </label>
            <input
              id="regName"
              type="text"
              name="name"
              placeholder="Your Name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="regEmail">
              <span className="label-text">Email</span>
            </label>
            <input
              id="regEmail"
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label" htmlFor="regMobile">
              <span className="label-text ">Mobile No</span>
            </label>
            <input
              id="regMobile"
              type="tel"
              name="phone"
              placeholder="01xxxxxxxxx"
              className="input input-bordered "
              maxLength="11"
              pattern="[0-9]{11}"
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="regPass">
              <span className="label-text">Password</span>
            </label>
            <input
              id="regPass"
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="countryName">
              <span className="label-text">Country</span>
            </label>
            <input
              id="countryName"
              type="text"
              name="country"
              placeholder="Country Name"
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
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  Registering{" "}
                  <span className="loading loading-spinner text-secondary"></span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
        <div className="card-body py-0">
          <p>
            Have an account ? Please{" "}
            <span className="font-semibold text-black hover:text-blue-500 transition-all duration-200">
              <Link to={"/login"}>Login</Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
