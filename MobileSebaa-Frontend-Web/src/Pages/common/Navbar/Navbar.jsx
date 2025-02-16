import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import brandLogo from "../../../assets/icon/mobileLogo.webp";

import Swal from "sweetalert2";
import { getUserFromToken } from "../../../Hooks/jwtDecode";

const Navbar = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = inputRef.current.value.trim();
    if (searchTerm) {
      navigate(`/searchShop?query=${encodeURIComponent(searchTerm)}`);
      inputRef.current.value = "";
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Successfully Logged Out",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate("/login");
    });
  };

  const routeLink = (
    <>
      <form className="search-field relative mb-2" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center">
          <input
            type="text"
            className="grow"
            placeholder="Type to search..."
            name="searchField"
            ref={inputRef}
            aria-label="Search"
          />
          <button>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </label>
      </form>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/contactUs">Contact</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/addShop">Add Shop</NavLink>
        </li>
      )}
      {user ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={
                  user?.photoURL ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li>
              <NavLink to="/manage-shop">Manage Shop</NavLink>
            </li>
            {user?.role === "Admin" && (
              <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </li>
            )}
            <li onClick={handleLogOut}>
              <NavLink to="/login">Logout</NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-gradient-to-r from-violet-500 to-fuchsia-500 pt-8 sticky top-0 z-50">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-white rounded-box w-52 h-52"
        >
          {routeLink}
        </ul>
      </div>
      <img
        className="w-20 rounded-3xl ml-12"
        src={brandLogo}
        alt="Brand Logo"
      />
      <div className="navbar-end hidden lg:flex items-center text-center grow">
        <ul className="menu menu-horizontal px-1 font-bold gap-4 md:pr-10">
          {routeLink}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
