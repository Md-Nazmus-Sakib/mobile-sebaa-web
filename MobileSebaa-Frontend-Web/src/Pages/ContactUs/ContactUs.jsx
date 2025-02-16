/* eslint-disable react/prop-types */
import { memo } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import HelmetComponent from "../../Hooks/HelmetComponent";
import repImg from "../../assets/Image/shop.jpg";
import mobileImg from "../../assets/Image/phoneIcon.png";
import emailImg from "../../assets/Image/email.png";
import socialImg from "../../assets/Image/social.png";
import "./ContactUs.css";

// Memoized component with displayName set
const ContactCard = memo(
  ({ imgSrc, title, description, contactInfo, children }) => (
    <div className="contact-card text-white my-4">
      <div className="contact-card-info">
        <div>
          <img className="w-28 mx-auto" src={imgSrc} alt={title} />
          <h1 className="text-3xl">{title}</h1>
          <p className="my-6">{description}</p>
          <div className="social-card">
            {children || (
              <p className="text-black font-extrabold">{contactInfo}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
);

ContactCard.displayName = "ContactCard"; // Adding displayName

const ContactUs = () => (
  <div>
    <HelmetComponent
      title="Contact Us | Get in Touch with MobileSebaa"
      description="Need help? Contact MobileSebaa for expert mobile repair assistance, service inquiries, or appointment bookings. Call, email, or visit us today!"
    />
    <div
      className="min-h-[650px] text-white flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${repImg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="w-full sm:w-2/3 text-justify px-2">
        <div className="h-[150px]">
          <div id="div1">
            <div id="l" style={{ margin: "33px" }}>
              <div className="pupil">
                <div className="p5">
                  <div className="pupl2">
                    <div className="pupil3" />
                    <div className="pupil4" />
                  </div>
                </div>
              </div>
            </div>
            <div id="m" style={{ margin: "33px" }}>
              <div className="pupil">
                <div className="p5">
                  <div className="pupl2">
                    <div className="pupil3" />
                    <div className="pupil4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-center my-4">
            Get In Touch
          </h1>
          <p className="text-xl my-8">
            Feel free to reach out to our dedicated team for all your needs.
            Whether you require repairs, technical assistance, or have inquiries
            about our services, we&apos;re here to help you.
          </p>
          <div className="flex justify-center">
            <div className="typewriter">
              <div className="slide">
                <i></i>
              </div>
              <div className="paper"></div>
              <div className="keyboard"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Cards Section */}
    <div className="md:flex justify-between gap-6 md:-mt-28 text-center">
      <ContactCard
        imgSrc={mobileImg}
        title="By Phone"
        description="Contact Us By Mobile"
        contactInfo="+880 17XXXXXXXX"
      />

      <ContactCard
        imgSrc={emailImg}
        title="By Email"
        description="Contact Us By Email"
        contactInfo="info@domain.com"
      />

      <ContactCard
        imgSrc={socialImg}
        title="By Social media"
        description="Contact us through social media."
      >
        <button className="Btn-social-icon facebook">
          <span className="svgContainer text-lg">
            <FaFacebook />
          </span>
          <span className="BG"></span>
        </button>

        <button className="Btn-social-icon whatsapp">
          <span className="svgContainer text-lg">
            <FaWhatsapp />
          </span>
          <span className="BG"></span>
        </button>

        <button className="Btn-social-icon instagram">
          <span className="svgContainer text-lg">
            <FaInstagram />
          </span>
          <span className="BG"></span>
        </button>
      </ContactCard>
    </div>
  </div>
);

export default ContactUs;
