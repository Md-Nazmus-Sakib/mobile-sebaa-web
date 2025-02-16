import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import HelmetComponent from "../../../Hooks/HelmetComponent";

const ShopRequest = () => {
  const token = localStorage.getItem("token");
  const { axiosPublic } = useAxiosPublic();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pendingShops"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/shop/request", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const pendingShops = data?.data?.pendingShops || [];
  const totalShopRequest = data?.data?.pendingShopsCount || 0;

  const handleStatusChange = (id, newStatus) => {
    if (!newStatus) return;

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
            `/api/shop/status/${id}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
            Swal.fire("Updated!", "Shop status has been updated.", "success");
            await refetch(); // ✅ Corrected refetch function to update data
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">Failed to load pending shops.</p>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <HelmetComponent
        title="Pending Shops | Review and Approve Listings"
        description="Manage and review shops awaiting approval. Verify details and take action on pending shop registrations."
      ></HelmetComponent>
      {/* Title */}
      <h1 className="text-center text-2xl font-bold">Pending Shop Requests</h1>
      <h2 className="text-center text-lg my-4">
        Total Pending Shops: {totalShopRequest}
      </h2>

      {/* Table */}
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
            {pendingShops.length > 0 ? (
              pendingShops.map((shop, index) => (
                <tr key={shop._id} className="hover:bg-gray-100">
                  <td>{index + 1}</td>
                  <td>{shop.shopName}</td>
                  <td>{shop.ownerName}</td>
                  <td>{shop.mobile}</td>
                  <td>
                    {shop.address}, {shop.selectedTown}, {shop.selectedDistrict}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        shop.status === "Approved"
                          ? "bg-green-500"
                          : shop.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="px-2 py-1 border rounded"
                      defaultValue=""
                      onChange={(e) =>
                        e.target.value &&
                        handleStatusChange(shop._id, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Change Status
                      </option>
                      <option value="Approve">Approve</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No pending shops found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopRequest;
