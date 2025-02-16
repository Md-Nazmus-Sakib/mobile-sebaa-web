import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import HelmetComponent from "../../../Hooks/HelmetComponent";

const pageSize = 50;

const AllUser = () => {
  const { axiosPublic } = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [finalSearchQuery, setFinalSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["allUsers", currentPage, finalSearchQuery],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/users?page=${currentPage}&limit=${pageSize}&searchTerm=${finalSearchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const allUsers = data?.data?.users || [];
  const totalUsers = data?.data?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = () => setFinalSearchQuery(searchQuery);

  const handleRoleChange = async (id, newRole) => {
    Swal.fire({
      title: `Change role to ${newRole}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.patch(
            `/api/users/role`,
            { id, role: newRole },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            await refetch();
            Swal.fire("Updated!", "User role has been changed.", "success");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to change role.",
            "error"
          );
        }
      }
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    Swal.fire({
      title: `Change status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Change",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.patch(
            `/api/users/status`,
            { id, status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            await refetch();
            Swal.fire("Updated!", "User status has been changed.", "success");
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to change status.",
            "error"
          );
        }
      }
    });
  };

  const roleColors = {
    Admin: "bg-red-500 text-white",
    User: "bg-blue-500 text-white",
    Sp: "bg-purple-500 text-white",
  };

  const statusColors = {
    "in-progress": "bg-green-500 text-black",
    blocked: "bg-gray-500 text-white",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load users.</p>;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <HelmetComponent
        title="All Users | Manage and View User Accounts"
        description="Browse and manage all registered users in the system. View user details, roles, and account statuses efficiently."
      ></HelmetComponent>

      <h1 className="text-center text-2xl font-bold ">All Users</h1>
      <h2 className="text-center text-lg my-4">Total User: {totalUsers}</h2>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />

          <button onClick={handleSearch} className="btn btn-primary ml-2">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <table className="table w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, index) => (
            <tr
              key={user._id}
              className={`border border-gray-200 ${
                user.isDeleted
                  ? "bg-red-200 text-white"
                  : user.isVerified === false
                  ? "bg-yellow-100"
                  : ""
              }`}
            >
              <td className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2">
                <select
                  className={`select select-bordered w-full ${
                    roleColors[user.role]
                  }`}
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="Admin" className="bg-red-500 text-white">
                    Admin
                  </option>
                  <option value="User" className="bg-blue-500 text-white">
                    User
                  </option>
                  <option value="Sp" className="bg-purple-500 text-white">
                    Sp
                  </option>
                </select>
              </td>
              <td className="p-2">
                <select
                  className={`select select-bordered w-full ${
                    statusColors[user.status]
                  }`}
                  value={user.status}
                  onChange={(e) => handleStatusChange(user._id, e.target.value)}
                >
                  <option
                    value="in-progress"
                    className="bg-green-500 text-black"
                  >
                    In-progress
                  </option>
                  <option value="blocked" className="bg-red-500 text-white">
                    Blocked
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>
        <span className="px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUser;
