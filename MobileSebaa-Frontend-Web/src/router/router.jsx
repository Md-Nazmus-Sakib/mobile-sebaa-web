import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home/Home";
import FindInDistricts from "../Pages/FindInDistricts/FindInDistricts";
import Login from "../Pages/Login/Login/Login";
import Register from "../Pages/Login/Register/Register";
import AddShopLocation from "../Pages/AddShopLocation/AddShopLocation";
import SearchShop from "../Pages/SearchShop/SearchShop";

import AllShop from "../Pages/Dashboard/AllShop/AllShop";

import ContactUs from "../Pages/ContactUs/ContactUs";
import PrivateRoute from "./PrivateRoute";

import Verification from "../Pages/common/Verification/Verification";
import UserProfile from "../Pages/UserProfile/UserProfile";
import ManageShop from "../Pages/ManageShop/ManageShop";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AllUser from "../Pages/Dashboard/AllUser/AllUser";
import ShopRequest from "../Pages/Dashboard/ShopRequest/ShopRequest";
import RejectShop from "../Pages/Dashboard/RejectShop/RejectShop";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/contactUs", element: <ContactUs /> },
      {
        path: "/addShop",
        element: (
          <PrivateRoute>
            <AddShopLocation />
          </PrivateRoute>
        ),
      },
      { path: "/searchShop", element: <SearchShop /> },
      { path: "/register", element: <Register /> },
      { path: "/verification", element: <Verification /> },
      { path: "/profile", element: <UserProfile /> },
      { path: "/manage-shop", element: <ManageShop /> },
      { path: "/manage-shop/:id", element: <ManageShop /> },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "", // Corrected path here, making it relative to /dashboard
            element: <Dashboard />,
          },
          {
            path: "allShop",
            element: <AllShop />,
          },
          {
            path: "allUser",
            element: <AllUser></AllUser>,
          },
          {
            path: "shopRequest",
            element: <ShopRequest></ShopRequest>,
          },
          {
            path: "rejectShop",
            element: <RejectShop></RejectShop>,
          },
          {
            path: "manage-shop/:id",
            element: <ManageShop></ManageShop>,
          },
        ],
      },
      { path: "/division/:districtName", element: <FindInDistricts /> },
    ],
  },
]);
