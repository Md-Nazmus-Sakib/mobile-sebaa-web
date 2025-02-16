/* eslint-disable react/prop-types */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserFromToken } from "../../Hooks/jwtDecode";
import HelmetComponent from "../../Hooks/HelmetComponent";

const EditShopModal = ({ shopData, isOpen, onClose }) => {
  const { axiosPublic } = useAxiosPublic();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const { role } = getUserFromToken();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (shopData) {
      reset({
        shopName: shopData.shopName || "",
        ownerName: shopData.ownerName || "",
        email: shopData?.shopEmail || shopData?.email || "",
        mobile: shopData.mobile || "",
        alterMobile: shopData.alterMobile || "",
        address: shopData.address || "",
        notes: shopData.notes || "",
        selectedDivision: shopData.selectedDivision || "",
        selectedDistrict: shopData.selectedDistrict || "",
        selectedTown: shopData.selectedTown || "",
        latitude: shopData?.shopLocation?.lat || "",
        longitude: shopData?.shopLocation?.long || "",
        serviceCategory: Array.isArray(shopData.serviceCategory)
          ? shopData.serviceCategory.join(", ")
          : shopData.serviceCategory || "",
      });
    }
  }, [shopData, reset]);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosPublic.put(
          `/api/shop/my-shop/${shopData?._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update shop");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["shopData"]);
      onClose();
    },
  });

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      serviceCategory: data.serviceCategory
        .split(",")
        .map((category) => category.trim()),
    };

    await mutation.mutateAsync(formattedData); // Ensure it waits for mutation
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <HelmetComponent
        title="Edit Shop Details | Update Shop Information"
        description="Modify and update shop details quickly. Change contact information, address, or other essential details to keep your listing accurate."
      ></HelmetComponent>
      <div className="modal-box max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Shop</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              setError(""); // Clear error message
              onClose(); // Close modal
            }}
          >
            ✕
          </button>
          {/* Shop Name */}
          <div>
            <label className="label">Shop Name</label>

            <input
              type="text"
              {...register(
                "shopName",
                role !== "Admin" ? { required: "Shop name is required" } : {}
              )}
              className="input input-bordered w-full"
            />
            {errors.shopName && (
              <p className="text-red-500">{errors.shopName.message}</p>
            )}
          </div>

          {/* Owner Name */}
          <div>
            <label className="label">Owner Name</label>
            <input
              type="text"
              {...register(
                "ownerName",
                role !== "Admin" ? { required: "Owner name is required" } : {}
              )}
              className="input input-bordered w-full"
            />
            {errors.ownerName && (
              <p className="text-red-500">{errors.ownerName.message}</p>
            )}
          </div>

          {/* Shop Email */}
          <div>
            <label className="label">Shop Email</label>
            <input
              type="email"
              {...register(
                "email",
                role !== "Admin" ? { required: "Shop email is required" } : {}
              )}
              className="input input-bordered w-full"
            />
            {errors.shopEmail && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Mobile Number</label>
              <input
                type="text"
                {...register(
                  "mobile",
                  role !== "Admin"
                    ? {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Invalid mobile number",
                        },
                      }
                    : {}
                )}
                className="input input-bordered w-full"
              />
              {errors.mobile && (
                <p className="text-red-500">{errors.mobile.message}</p>
              )}
            </div>
            <div>
              <label className="label">Alternative Mobile</label>
              <input
                type="text"
                {...register("alterMobile", {
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: "Invalid mobile number",
                  },
                })}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="label">Address</label>
            <input
              type="text"
              {...register(
                "address",
                role !== "Admin" ? { required: "Address is required" } : {}
              )}
              className="input input-bordered w-full"
            />
            {errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              {...register("notes")}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Service Categories */}
          <div>
            <label className="label">Service Categories</label>
            <input
              type="text"
              {...register("serviceCategory")}
              className="input input-bordered w-full"
            />
            <small className="text-gray-500">
              Separate categories with commas
            </small>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Division</label>
              <input
                type="text"
                {...register("selectedDivision")}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">District</label>
              <input
                type="text"
                {...register("selectedDistrict")}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">Town</label>
              <input
                type="text"
                {...register("selectedTown")}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          {/* Latitude & Longitude */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Latitude</label>
              <input
                type="text"
                {...register(
                  "latitude",
                  role !== "Admin" ? { required: "Latitude is required" } : {}
                )}
                className="input input-bordered w-full"
              />
              {errors.latitude && (
                <p className="text-red-500">{errors.latitude.message}</p>
              )}
            </div>
            <div>
              <label className="label">Longitude</label>
              <input
                type="text"
                {...register(
                  "longitude",
                  role !== "Admin" ? { required: "Longitude is required" } : {}
                )}
                className="input input-bordered w-full"
              />
              {errors.longitude && (
                <p className="text-red-500">{errors.longitude.message}</p>
              )}
            </div>
          </div>
          {error && (
            <div className="label">
              <p className="text-red-500 rounded-md font-bold bg-white p-2">
                {error}
              </p>
            </div>
          )}
          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setError(""); // Clear error message
                onClose(); // Close modal
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {loading ? (
                <>
                  Saving{" "}
                  <span className="loading loading-spinner text-secondary"></span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditShopModal;
