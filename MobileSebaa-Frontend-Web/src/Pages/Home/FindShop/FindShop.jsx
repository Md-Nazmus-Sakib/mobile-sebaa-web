import { useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import sliderSettings from "./SliderSettings"; // If moved to separate file
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FindShop.css";

import dhakaImg from "../../../assets/Image/District/dhaka.jpg";
import barisalImg from "../../../assets/Image/District/barishal.jpg";
import chittagongImg from "../../../assets/Image/District/chittagong.jpg";
import khulnaImg from "../../../assets/Image/District/Khulna.jpg";
import mymensinghImg from "../../../assets/Image/District/mymensingh.jpg";
import rajshahiImg from "../../../assets/Image/District/rajshahi.jpg";
import shyletImg from "../../../assets/Image/District/shylet.jpg";
import rangpurImg from "../../../assets/Image/District/rangpur.jpg";

const FindShop = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = inputRef.current?.value.trim();
    if (searchTerm) {
      navigate(`/searchShop?query=${encodeURIComponent(searchTerm)}`);
      inputRef.current.value = "";
    }
  };

  const districts = [
    { name: "Barisal", img: barisalImg },
    { name: "Chittagong", img: chittagongImg },
    { name: "Dhaka", img: dhakaImg },
    { name: "Khulna", img: khulnaImg },
    { name: "Rajshahi", img: rajshahiImg },
    { name: "Rangpur", img: rangpurImg },
    { name: "Mymensingh", img: mymensinghImg },
    { name: "Sylhet", img: shyletImg },
  ];

  return (
    <div className="bg-gradient-to-r from-[#3F096B] to-[#27094C] text-white mt-60">
      <motion.h1
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 2, delay: 0.5 }}
        className="sm:w-1/2 mx-auto text-4xl text-center py-6 font-extrabold tracking-wide"
      >
        Please initiate the repair process for your mobile device
      </motion.h1>

      <motion.div
        transition={{ type: "spring", duration: 2 }}
        className="mx-auto mt-8"
      >
        <div className="font-bold text-xl py-4 text-white text-center">
          Find mobile repair shop near you ↓
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-center p-5">
              <div className="rounded-lg bg-gray-200 md:p-5">
                <div className="flex">
                  <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white md:p-5">
                    🔍
                  </div>
                  <input
                    type="text"
                    className="w-full md:max-w-[300px] bg-white pl-2 text-black md:font-semibold outline-0"
                    placeholder="Type to search..."
                    ref={inputRef}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 p-2 rounded-tr-lg rounded-br-lg text-white md:font-semibold hover:bg-blue-800 transition-colors"
                    aria-label="Search for mobile repair shop"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Slider Section */}
      <div className="col-span-1 md:col-span-2 mx-5 my-8">
        <Slider {...sliderSettings}>
          {districts.map((district) => (
            <div
              key={district.name}
              className="px-2 py-4 rounded-3xl mx-4 group8 shadow1 item my-4 text-center"
            >
              <img
                className="h-28 w-full px-4 sm:h-40 rounded-3xl relative"
                src={district.img}
                alt={`${district.name} Image`}
                loading="lazy"
              />
              <h1 className="text-xl text-white mt-6">{district.name}</h1>
              <div className="overlay rounded-3xl"></div>
              <Link
                to={`/division/${district.name}`}
                className="card-btn text-black"
                aria-label={`View mobile repair shops in ${district.name}`}
              >
                {district.name}
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FindShop;
