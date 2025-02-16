/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import "./ShopDetail.css";
import HelmetComponent from "../../Hooks/HelmetComponent";

const ShopDetail = ({ shop }) => {
  const navigate = useNavigate();
  const {
    address,

    mobile,

    ownerName,
    selectedDivision,
    selectedDistrict,
    selectedTown,
    shopName,
  } = shop;
  // console.log(shop)
  return (
    <div className="flex justify-center my-12">
      <HelmetComponent
        title="Shop Details | View Shop Information"
        description="Explore detailed information about the shop, including location, contact details, services, and customer reviews. Get all the info you need before visiting."
      ></HelmetComponent>
      <article className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s]">
        <div className="w-96 rounded-[10px] text-white p-4">
          <h3 className="mt-0.5 text-2xl font-medium ">
            🏪
            <span className="group-hover:text-red-500 mt-3 ml-3 text-2xl font-black uppercase leading-6  transition-all duration-500 ease-in-out transform hover:scale-105 hover:text-blue-800 ">
              {shopName}
            </span>
          </h3>
          <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
            <strong>Owner:</strong> {ownerName}
          </p>
          <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
            <strong>Phone:</strong> {mobile}
          </p>
          <p className="text-md mt-5 border-l-4 border-red-500 pl-4 leading-6 transition-all duration-500 ease-in-out transform hover:border-blue-500 hover:text-gray-600">
            <strong>Address:</strong> {address}, {selectedTown},{" "}
            {selectedDistrict},{selectedDivision}
          </p>

          <div className="mt-4 flex flex-wrap gap-1">
            <button
              className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600"
              onClick={() => navigate(`/manage-shop/${shop._id}`)}
            >
              details
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ShopDetail;
