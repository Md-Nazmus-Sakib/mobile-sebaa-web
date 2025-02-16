import { Outlet } from "react-router-dom";
import Navbar from "../Pages/common/Navbar/Navbar";
import Footer from "../Pages/common/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
