import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import imgProfile from "../../assets/Image/owner.png";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import HelmetComponent from "../../Hooks/HelmetComponent";
import EditProfileModal from "./EditProfileModal";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { axiosPublic } = useAxiosPublic();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdateProfileOpen, setUpdateProfileOpen] = useState(false);

  // ✅ Fetch user data
  const {
    data: userData = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axiosPublic.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    },
    enabled: !!token,
  });

  // ✅ Upload Profile Image
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosPublic.put(
        "/api/users/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
    },
  });

  // ✅ Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      uploadMutation.mutate(file);
    }
  };

  // ✅ Open file picker
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // ✅ Update Profile Data
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosPublic.put("/api/users/me", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
      setUpdateProfileOpen(false);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile Update Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const handleSaveProfile = (updatedData) => {
    updateProfileMutation.mutate(updatedData);
  };

  if (isLoading) return <div className="text-center my-12">Loading...</div>;
  if (isError)
    return (
      <div className="text-center my-12 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <HelmetComponent
        title="User Profile | MobileSebaa"
        description="View and manage your MobileSebaa account details, including name, email, phone number, and role."
      />

      <div className="flex justify-center items-center my-12 w-full">
        <div className="profile-card w-80 md:w-1/2 rounded-md overflow-hidden bg-white flex flex-col items-center justify-center gap-3 group py-6 relative transition-all duration-300 shadow-[0_0_30px_rgba(0,183,255,0.5)]">
          <div className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1">
            <div className="img_container w-36 flex items-center justify-center relative ring-primary ring-offset-base-100  rounded-full ring ring-offset-2">
              {/* ✅ Clickable Profile Image */}
              <img
                src={selectedImage || userData?.profileImg || imgProfile}
                alt="Profile"
                className="cursor-pointer w-36 h-36 rounded-full object-cover"
                onClick={handleImageClick}
              />
              {/* ✅ Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className="headings text-center leading-4">
            <p className="text-2xl font-serif font-semibold text-[#434955]">
              👰🏻‍♂️ {userData?.name || "Unknown User"}
            </p>
            <p> 🧚🏾‍♂️{userData?.role || "N/A"}</p>
          </div>
          <div className="divider"></div>

          <div className="divider"></div>
          <div className="w-full items-center justify-center flex">
            <ul className="flex flex-col items-start gap-2 text-xl font-semibold text-[#434955]">
              <li className="shadow-lg shadow-blue-500/40  w-full">
                📞 {userData?.phone || "N/A"}
              </li>
              <li className="shadow-lg shadow-blue-500/40 w-full my-3">
                📧 {userData?.email || "N/A"}
              </li>
              <li className="shadow-lg shadow-blue-500/40 w-full ">
                🌍 {userData?.country || "N/A"}
              </li>
            </ul>
          </div>
          <button
            className="btn btn-outline btn-primary btn-wide mt-6"
            onClick={() => setUpdateProfileOpen(true)}
          >
            Update Profile
          </button>
        </div>
      </div>

      {/* ✅ Profile Edit Modal */}
      <EditProfileModal
        isOpen={isUpdateProfileOpen}
        onClose={() => setUpdateProfileOpen(false)}
        userData={userData}
        onSave={handleSaveProfile}
      ></EditProfileModal>
    </div>
  );
};

export default UserProfile;
