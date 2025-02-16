import { useQuery } from "@tanstack/react-query";
import repairImg from "../../assets/Image/shop.jpg";
import ShopDetail from "./ShopDetail";
import HelmetComponent from "../../Hooks/HelmetComponent";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const pageSize = 18;

const SearchShop = () => {
  const { axiosPublic } = useAxiosPublic();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query");
    setSearchQuery(query || "");
  }, [location.search]);

  const {
    data,
    isLoading: searchShopsLoading,
    isError,
  } = useQuery({
    queryKey: ["allShops", currentPage, searchQuery],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/api/shop?page=${currentPage}&limit=${pageSize}&searchTerm=${searchQuery}`
      );
      return res.data;
    },
    keepPreviousData: true,
    enabled: !!searchQuery,
  });

  const searchShops = data?.data?.shop || [];
  const totalShops = data?.data?.totalShop || 0; // Ensure this reflects the total count, not just current page length.

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const calculateIndex = (index) => (currentPage - 1) * pageSize + index + 1;

  if (searchShopsLoading) {
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
    <div
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${repairImg})`,
        backgroundSize: "cover",
      }}
      className="w-full h-screen overflow-y-auto text-white py-8"
    >
      <HelmetComponent
        title="Search | Find Shops and Services"
        description="Search for shops and services within your area. Use filters and categories to find exactly what you're looking for quickly and easily."
      ></HelmetComponent>

      <h2 className="text-center text-lg my-4">
        Total Shops Found: {totalShops}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchShops.length > 0 ? (
          searchShops.map((shop, index) => (
            <ShopDetail
              key={shop._id}
              shop={shop}
              index={calculateIndex(index)}
            />
          ))
        ) : (
          <div className="flex justify-center items-center w-screen">
            <h1 className="text-4xl">
              No Shop Is Found! Try another location.
            </h1>
          </div>
        )}
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
          disabled={currentPage >= Math.ceil(totalShops / pageSize)}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchShop;
