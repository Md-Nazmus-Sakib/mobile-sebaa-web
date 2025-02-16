import HelmetComponent from "../../../Hooks/HelmetComponent";
import Banner from "../Banner/Banner";
import FindShop from "../FindShop/FindShop";
import Services from "../Services/Services";

const Home = () => {
  return (
    <div className=" bg-gradient-to-r from-[#3F096B] to-[#27094C]">
      <HelmetComponent
        title="MobileSebaa | Expert Mobile Repair Services"
        description="Get fast, reliable, and affordable mobile repair services at MobileSebaa. We fix screens, batteries, water damage, and more. Your phone, as good as new!"
      ></HelmetComponent>

      <Banner></Banner>
      <FindShop></FindShop>
      <Services></Services>
    </div>
  );
};

export default Home;
