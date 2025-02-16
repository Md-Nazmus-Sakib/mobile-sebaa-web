import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa";
import footerLogo from "../../../assets/icon/mobileLogo.webp";

const Footer = () => {
  return (
    <footer className="footer footer-center p-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white pb-5">
      <div className="sm:flex justify-between sm:w-full sm:px-12">
        <div className="flex flex-col sm:flex-row justify-center items-center ">
          <h1 className="font-bold text-3xl">
            <img
              className="w-20 h-20 rounded-3xl"
              src={footerLogo}
              alt="MobileSebaa logo"
              width="80" // Add width and height for image optimization
              height="80"
            />
            <span className="text-xl">Providing reliable tech since 2023</span>
          </h1>
        </div>

        <nav>
          <h2 className="text-2xl border-b-2 mb-4">Follow Us</h2>{" "}
          {/* Updated to h2 for accessibility */}
          <div className="grid grid-flow-col gap-4 text-xl">
            <a
              href="https://twitter.com/"
              aria-label="Follow us on Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://web.whatsapp.com/"
              aria-label="Message us on WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.facebook.com/"
              aria-label="Follow us on Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          </div>
        </nav>
      </div>
      <div className="border-4 px-4 h-20 rounded-full bg-black text-white">
        <p>Copyright © 2023 - All rights reserved MobileSebaa.com</p>
      </div>
    </footer>
  );
};

export default Footer;
