import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HelmetComponent from "../../Hooks/HelmetComponent";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { getUserFromToken } from "../../Hooks/jwtDecode";

const AddShopLocation = () => {
  const user = getUserFromToken();
  const token = localStorage.getItem("token");
  const [locations, setLocations] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTown, setSelectedTown] = useState("");
  const [serviceCategory, setServiceCategory] = useState([]);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [isGeoEnabled, setIsGeoEnabled] = useState(true);
  const [error, setError] = useState("");
  const { axiosPublic } = useAxiosPublic();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        () => setIsGeoEnabled(false),
        { enableHighAccuracy: true }
      );
    } else {
      setIsGeoEnabled(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/api/locations");
        setLocations(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchData();
  }, [axiosPublic]);

  const handleAddShop = async (e) => {
    e.preventDefault();
    const form = e.target;
    const shopInfo = {
      shopName: form.shopName.value,
      ownerName: form.ownerName.value,
      shopEmail: form.email2.value,
      mobile: form.mobile.value,
      alterMobile: form.alterMobile.value,
      address: form.address.value,
      notes: form.notes.value,
      selectedDivision,
      selectedDistrict,
      selectedTown,
      serviceCategory,
      shopLocation: { lat, long },
      userEmail: user?.email,
    };

    if (
      !selectedDivision ||
      !selectedDistrict ||
      !selectedTown ||
      serviceCategory.length === 0
    ) {
      return setError("All fields including service category are required.");
    }

    try {
      const res = await axiosPublic.post("/api/shop/create-shop", shopInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        Swal.fire("Success", "Shop added successfully.", "success");
        form.reset();
        setError("");
        setServiceCategory([]);
      }
    } catch (error) {
      console.log(error.response.data);
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const renderSelect = (id, label, options, value, onChange) => (
    <div className="flex flex-col gap-4">
      <label htmlFor={id} className="text-white">
        {label} <span className="text-red-500 ml-2 text-xl">★</span>
      </label>
      <select
        value={value}
        onChange={onChange}
        className="select select-bordered"
        id={id}
      >
        <option value="">Select {label}</option>
        {options
          ?.sort((a, b) => a.name?.localeCompare(b.name))
          .map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
      </select>
    </div>
  );

  const renderCheckboxes = (categories) => (
    <div className="flex flex-wrap gap-4 mt-2 bg-white rounded-lg p-4">
      {categories.map((category) => (
        <label key={category} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={category}
            onChange={(e) => {
              const newCategories = e.target.checked
                ? [...serviceCategory, category]
                : serviceCategory.filter((item) => item !== category);
              setServiceCategory(newCategories);
            }}
            className="checkbox"
          />
          <span>{category}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen p-6 bg-gray-500">
      <HelmetComponent
        title="Add Your Shop"
        description="Register your shop to expand your business."
      />
      <h1 className="text-4xl font-bold text-white">Register Your Shop</h1>
      <form onSubmit={handleAddShop} className="card-body">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col mt-6">
            <label htmlFor="shopName" className="text-white">
              Shop Name <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            <input
              type="text"
              name="shopName"
              id="shopName"
              placeholder="Shop Name"
              required
              className="input input-bordered"
            />
          </div>
          <div className="flex flex-col mt-6">
            <label htmlFor="ownerName" className="text-white">
              Owner Name <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            <input
              type="text"
              name="ownerName"
              id="ownerName"
              placeholder="Owner Name"
              required
              className="input input-bordered"
            />
          </div>
          <div className="flex flex-col mt-6">
            <label htmlFor="email2" className="text-white">
              Email <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            <input
              type="email"
              name="email2"
              id="email2"
              placeholder="Email"
              className="input input-bordered"
            />
          </div>
          <div className="flex flex-col mt-6">
            <label htmlFor="mobile" className="text-white">
              Mobile <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            <input
              type="tel"
              name="mobile"
              id="mobile"
              placeholder="Mobile"
              required
              className="input input-bordered"
            />
          </div>
          <div className="flex flex-col mt-6">
            <label htmlFor="alterMobile" className="text-white">
              Alternative Mobile
            </label>
            <input
              type="tel"
              name="alterMobile"
              id="alterMobile"
              placeholder="Alternative Mobile"
              className="input input-bordered"
            />
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <label htmlFor="address" className="text-white">
            Full Address <span className="text-red-500 ml-2 text-xl">★</span>
          </label>
          <textarea
            name="address"
            id="address"
            placeholder="Full Address"
            required
            className="textarea textarea-bordered mt-4"
          />
        </div>
        <div className="flex flex-col mt-6">
          <label htmlFor="notes" className="text-white">
            Additional Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            placeholder="Additional Notes"
            className="textarea textarea-bordered mt-4"
          />
        </div>

        {/* Location Selectors */}
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {renderSelect(
            "division",
            "Select Division",
            locations?.divisions,
            selectedDivision,
            (e) => setSelectedDivision(e.target.value)
          )}

          {renderSelect(
            "district",
            "Select District",
            selectedDivision
              ? locations?.divisions?.find(
                  (div) => div.name === selectedDivision
                )?.districts
              : [],
            selectedDistrict,
            (e) => setSelectedDistrict(e.target.value)
          )}

          {renderSelect(
            "town",
            "Select Town",
            selectedDistrict
              ? locations?.divisions
                  ?.find((div) => div.name === selectedDivision)
                  ?.districts?.find((dis) => dis.name === selectedDistrict)
                  ?.towns
              : [],
            selectedTown,
            (e) => setSelectedTown(e.target.value)
          )}
        </div>

        {/* Service Category */}
        <div className="mt-4">
          <label className="text-white">
            Service Categories{" "}
            <span className="text-red-500 ml-2 text-xl">★</span>
          </label>
          {renderCheckboxes([
            "Display Issue",
            "Motherboard Issue",
            "Touchpad Issue",
            "Network Issue",
            "Green Line Issue",
            "Charging Issue",
            "Camera Issue",
            "Battery Issue",
            "Speaker/Microphone Issue",
            "Water Damage",
            "Software Issue",
            "Phone Unlocking",
            "Overheating Issue",
            "Storage Full Issue",
            "Bluetooth & Wi-Fi Issue",
            "Power Button Issue",
            "Volume Button Issue",
            "Back Glass Replacement",
            "IMEI Repair",
            "Other",
          ])}
        </div>

        {/* Latitude and Longitude */}
        <div className="flex gap-4">
          <div className="flex flex-col mt-4">
            <label className="text-white mr-4">
              Latitude <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            {isGeoEnabled ? (
              <input
                type="text"
                value={lat || ""}
                readOnly
                className="input input-bordered"
              />
            ) : (
              <input
                type="number"
                value={lat || ""}
                onChange={(e) => setLat(e.target.value)}
                className="input input-bordered"
                placeholder="Enter Latitude"
              />
            )}
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-white mr-4">
              Longitude <span className="text-red-500 ml-2 text-xl">★</span>
            </label>
            {isGeoEnabled ? (
              <input
                type="text"
                value={long || ""}
                readOnly
                className="input input-bordered"
              />
            ) : (
              <input
                type="number"
                value={long || ""}
                onChange={(e) => setLong(e.target.value)}
                className="input input-bordered"
                placeholder="Enter Longitude"
              />
            )}
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary mt-8">
            Add Shop
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddShopLocation;
