import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import HelmetComponent from "../../../Hooks/HelmetComponent";

const RejectShop = () => {
  const token = localStorage.getItem("token");
  const { axiosPublic } = useAxiosPublic();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["rejectShops"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/shop/rejected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const rejectShops = data?.data?.rejectShops || [];
  const totalShopReject = data?.data?.rejectShopsCount || 0;

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
      <p className="text-center text-red-500">Failed to load reject shops.</p>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <HelmetComponent
        title="Rejected Shops | Review and Manage Listings"
        description="View and manage shops that have been rejected. Review details, update statuses, and take necessary actions for shop approvals."
      ></HelmetComponent>
      {/* Title */}
      <h1 className="text-center text-2xl font-bold">Reject Shop Requests</h1>
      <h2 className="text-center text-lg my-4">
        Total reject Shops: {totalShopReject}
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
            {rejectShops.length > 0 ? (
              rejectShops.map((shop, index) => (
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
                  <td>
                    <select
                      className="px-2 py-1 border rounded"
                      defaultValue=""
                      onChange={(e) =>
                        e.target.value &&
                        handleStatusChange(shop?._id, e.target.value)
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

export default RejectShop;
