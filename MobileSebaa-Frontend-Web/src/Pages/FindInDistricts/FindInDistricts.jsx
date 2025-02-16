import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import District from "./District";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import HelmetComponent from "../../Hooks/HelmetComponent";

const FindInDistricts = () => {
  const { districtName } = useParams();
  const { axiosPublic } = useAxiosPublic();
  // console.log(districtName)
  const [locationName, setLocationName] = useState([]);
  // console.log(locationName.divisions)
  const districts = locationName?.divisions?.find(
    (location) => location.name === districtName
  );
  // console.log(districts?.districts)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/api/locations");
        setLocationName(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchData();
  }, [axiosPublic]);

  return (
    <div className="my-12 bg-black">
      <HelmetComponent
        title="Find Shops in Your District | Local Business Directory"
        description="Discover the best shops in your district with our local business directory. Easily locate stores, services, and markets near you for all your shopping needs."
      ></HelmetComponent>
      {districts?.districts &&
        districts.districts.map((dis, index) => (
          <District key={index} dis={dis}></District>
        ))}
    </div>
  );
};

export default FindInDistricts;
