/* eslint-disable react/prop-types */
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import EditShopModal from "./EditShopModal";
import { useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import HelmetComponent from "../../Hooks/HelmetComponent";

const ManageShop = () => {
  const { id } = useParams();

  const { axiosPublic } = useAxiosPublic();
  const token = localStorage.getItem("token");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch shop data
  const {
    data: shopData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["shopData", id], // Include id in the query key
    queryFn: async () => {
      try {
        const endpoint = id ? `/api/shop/my-shop/${id}` : "/api/shop/my-shop";
        const headers = id ? {} : { Authorization: `Bearer ${token}` }; // Only use token if id is absent
        const response = await axiosPublic.get(endpoint, { headers });

        return response.data.data;
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to fetch shop data"
        );
      }
    },
    enabled: !!token || !!id, // Enable query only if token or id is present
  });

  // Delete shop mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axiosPublic.delete(`/api/shop/my-shop/${shopData?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      QueryClient.invalidateQueries(["shopData"]);
      Swal.fire({
        title: "Deleted!",
        text: "The shop has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (err) => {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to delete the shop.",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  // Handle Delete Confirmation
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError || !shopData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 font-bold">
          {error?.message || "Failed to load shop data."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
      <HelmetComponent
        title="Manage Shop | Edit and Control Shop Listings"
        description="Easily manage your shop listings. Update details, review performance, and make changes to improve your shop’s visibility and operations."
      ></HelmetComponent>
      <article className="rounded-lg border-4 border-black bg-gradient-to-b from-white via-gray-100 to-gray-200 md:p-6 shadow-[8px_8px_0_0_#000] transition-transform duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white md:ml-4 hover:shadow-[12px_12px_0_0_#000]">
        <div className="flex justify-start md:justify-center">
          <div className="card-body">
            <div className="relative">
              <h2 className="group-hover:text-red-500 mt-3 text-2xl font-black uppercase leading-6 text-black transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-blue-800">
                {shopData?.shopName}
              </h2>
              <p
                className={`badge ${
                  shopData?.status === "Pending"
                    ? "badge-warning animate-ping"
                    : "badge-success"
                } text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105 active:scale-95 absolute z-10 -top-4 md:top-0 right-0`}
              >
                <span>{shopData?.status}</span>
              </p>
            </div>
            <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
              <strong>Owner:</strong> {shopData?.ownerName}
            </p>
            <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
              <strong>Phone:</strong> {shopData?.mobile}
            </p>
            {shopData?.alterMobile && (
              <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
                <strong>Alter Mobile:</strong> {shopData?.alterMobile}
              </p>
            )}
            {shopData?.notes && (
              <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
                <strong>Notes:</strong> {shopData?.notes}
              </p>
            )}
            <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
              <strong>Services:</strong>{" "}
              {shopData?.serviceCategory?.length
                ? shopData.serviceCategory.join(", ")
                : "No services available"}
            </p>
            <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
              <strong>Address:</strong> {shopData?.address},{" "}
              {shopData?.selectedTown}, {shopData?.selectedDistrict},
              {shopData?.selectedDivision}
            </p>
            {!id && (
              <div className="card-actions mt-4">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setIsEditOpen(true)}
                >
                  Edit Shop
                </button>
                <button className="btn btn-error w-full" onClick={handleDelete}>
                  Delete Shop
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Map Section */}
      <div className="shadow-[8px_8px_0_0_#000] rounded-lg transition-transform duration-500 ease-in-out transform hover:scale-105 md:mr-4">
        {shopData?.shopLocation?.lat && shopData?.shopLocation?.long ? (
          <MapContainer
            center={[shopData.shopLocation.lat, shopData.shopLocation.long]}
            zoom={15}
            className="border-4 border-black shadow-lg rounded-lg w-full h-96 md:h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[shopData.shopLocation.lat, shopData.shopLocation.long]}
            >
              <Popup>
                <strong>{shopData.shopName}</strong>
                <br />
                {shopData.address}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">
            No location data available.
          </p>
        )}
      </div>

      {/* Edit Shop Modal */}
      {!id && (
        <EditShopModal
          shopData={shopData}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageShop;
