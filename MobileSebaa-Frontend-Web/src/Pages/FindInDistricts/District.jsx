/* eslint-disable react/prop-types */

import "./District.css";
import { useNavigate } from "react-router-dom";
import HelmetComponent from "../../Hooks/HelmetComponent";

const District = ({ dis }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border my-12 overflow-hidden">
      <HelmetComponent
        title="Home/Districts Page"
        description="This is mobilesebaa Home/Districts Page."
      />

      <div className="card my-12 col-span-1">
        <div className="card-body flex flex-col items-center justify-center">
          {/* Only show loader if there's a need */}
          {dis?.name ? (
            <h2 className="card-title text-3xl font-extrabold my-4 text-white">
              {dis.name}
            </h2>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      </div>

      <div className="text-white col-span-1 lg:col-span-2 flex flex-wrap items-center justify-center gap-4 container-town">
        <div id="container-stars">
          <div id="stars"></div>
        </div>

        {dis?.towns?.map((town, index) => (
          <button
            key={index}
            onClick={() =>
              navigate(`/searchShop?query=${encodeURIComponent(town)}`)
            }
            className="button-town text-2xl font-bold mx-2"
          >
            {town}
          </button>
        ))}
      </div>
    </div>
  );
};

export default District;
