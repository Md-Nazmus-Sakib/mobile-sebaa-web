import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaEdit, FaEye, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import EditShopModal from "../../ManageShop/EditShopModal";
import HelmetComponent from "../../../Hooks/HelmetComponent";

const pageSize = 50;

const AllShop = () => {
  const navigate = useNavigate();
  const { axiosPublic } = useAxiosPublic();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopData, setShopData] = useState(null);
  const [finalSearchQuery, setFinalSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch shops using react-query
  const {
    data,
    isLoading: allShopsLoading,
    isError,
    refetch: allShopsRefetch,
  } = useQuery({
    queryKey: ["allShops", currentPage, finalSearchQuery],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/shop?page=${currentPage}&limit=${pageSize}&searchTerm=${finalSearchQuery}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });
  const allShops = data?.data?.shop || [];
  const totalShops = data?.data?.totalShop || 0;

  const calculateIndex = (index) => (currentPage - 1) * pageSize + index + 1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosPublic.delete(`/api/shop/my-shop/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          await allShopsRefetch(); // Refetch shop data
          Swal.fire("Deleted!", "Your shop has been deleted.", "success");
        }
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to delete shop",
          "error"
        );
      }
    }
  };
  // Trigger search when clicking the button
  const handleSearch = () => {
    setFinalSearchQuery(searchQuery);
  };
  const handleEdit = (shopId) => {
    const selectedShop = allShops.find((shop) => shop._id === shopId);
    setShopData(selectedShop);
    setIsEditOpen(true);
  };
  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: `Change status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosPublic.patch(
            `/api/shop/status/${id}`, // Fixed URL format
            { status: newStatus },
            {
              headers: {
                Authorization: `Bearer ${token}`, // 🔐 Add token to headers
              },
            }
          );

          if (response.status === 200) {
            Swal.fire("Updated!", "Shop status has been updated.", "success");
            await allShopsRefetch(); // 🔄 Refetch updated data
          }
        } catch (error) {
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to update shop status",
            "error"
          );
        }
      }
    });
  };

  if (allShopsLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load shops.</p>;
  }

  return (
    <div className="p-6">
      <HelmetComponent
        title="AllShop | Browse & Manage Shops"
        description="Discover and manage all shops on AllShop. Stay informed about shop activities, updates, and essential details for a seamless experience."
      ></HelmetComponent>
      <h1 className="text-center text-2xl font-bold ">All Shops</h1>
      <h2 className="text-center text-lg my-4">Total Shops: {totalShops}</h2>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md flex items-center">
          <input
            type="text"
            placeholder="Search shop by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
          <FaSearch className="absolute left-3 text-gray-500" />
          <button onClick={handleSearch} className="btn btn-primary ml-2">
            Search
          </button>
        </div>
      </div>

      {/* Shop Table */}
      <div className="overflow-auto my-6">
        <table className="table w-full border rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th>#</th>
              <th>Shop Name</th>
              <th>Owner</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allShops.length > 0 ? (
              allShops.map((shop, index) => (
                <tr key={shop._id} className="hover:bg-gray-700">
                  <td>{calculateIndex(index)}</td>
                  <td>{shop.shopName}</td>
                  <td>{shop.ownerName}</td>
                  <td>{shop.mobile}</td>
                  <td>
                    {shop.address}, {shop.selectedTown}, {shop.selectedDistrict}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        shop.status === "Approve"
                          ? "bg-green-500"
                          : shop.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      title="View Details"
                      onClick={() =>
                        navigate(`/dashboard/manage-shop/${shop._id}`)
                      }
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                    <button
                      className="text-green-500 hover:text-green-700"
                      title="Edit Shop"
                      onClick={() => handleEdit(shop._id)}
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(shop._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Shop"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                    <select
                      className="ml-2 px-2 py-1 border rounded"
                      value={shop.status}
                      onChange={(e) =>
                        handleStatusChange(shop._id, e.target.value)
                      }
                    >
                      <option value="Approve">Approve</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No shops found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 my-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn"
        >
          Prev
        </button>

        {Array.from(
          { length: Math.ceil(totalShops / pageSize) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`btn ${
                currentPage === index + 1 ? "btn-active font-bold" : ""
              }`}
            >
              {index + 1}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={allShops.length < pageSize}
          className="btn"
        >
          Next
        </button>
      </div>
      <EditShopModal
        shopData={shopData}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
};

export default AllShop;
