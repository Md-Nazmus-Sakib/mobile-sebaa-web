import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import bannerRight from "../../../assets/json/banner_animation.json";
import banner_1 from "../../../assets/Banner_Image/img-1.webp";
import banner_2 from "../../../assets/Banner_Image/img-2.webp";
import banner_3 from "../../../assets/Banner_Image/img-3.webp";
import banner_4 from "../../../assets/Banner_Image/img-4.webp";
import Slider from "react-slick";
import Lottie from "lottie-react";

const Banner = () => {
  const settings = {
    arrows: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000, // Slightly longer to reduce CPU usage
    lazyLoad: "ondemand", // Optimize image loading
  };

  return (
    <div className="relative">
      {/* Floating Points */}
      <div className="points_wrapper">
        {Array.from({ length: 10 }).map((_, index) => (
          <i key={index} className="point"></i>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative py-4 rounded-b-xl min-h-[800px] flex justify-center items-center flex-col md:flex-row overflow-hidden bg-gradient-to-r from-[#3F096B] to-[#27094C] text-white">
        {/* Left Side - Hero Content */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative pb-20">
          <div className="w-full p-4 text-center mx-auto mb-4">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5, x: -200 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-4xl font-serif font-extrabold"
            >
              <span className="text-red-300">Damaged Device? </span> We Repair
              Everything.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="my-8"
            >
              To know more about our services and talk to our expert about
              what&apos;s wrong with your device, you can reach us through email
              or give us a call for quick assistance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="w-full"
            >
              <NavLink to="/contactUs">
                <button className="ui-btn rounded-lg mx-auto wrapper">
                  <span className="font-extrabold text-2xl">Get in Touch</span>
                </button>
              </NavLink>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Image Slider */}
        <div className="w-full md:w-1/2">
          <Slider {...settings}>
            {[banner_1, banner_2, banner_3, banner_4].map((banner, index) => (
              <div key={index} className="rounded-xl overflow-hidden">
                <img
                  src={banner}
                  alt={`damaged mobile phone ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Lottie Animation (Moved to Bottom) */}
      <div className="absolute -bottom-1/4 left-0 w-full pointer-events-none">
        <Lottie animationData={bannerRight} loop={true} />
      </div>
    </div>
  );
};

export default Banner;
