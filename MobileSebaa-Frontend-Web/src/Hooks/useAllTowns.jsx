// import { useEffect, useState } from "react";

// const useAllTowns = () => {
//   const [allTownNames, setAllTownNames] = useState([]);
//   // console.log(allTownNames)
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         const response = await fetch("./locationData.json"); // Replace with your API endpoint
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const data = await response.json();

//         const towns = data.divisions.reduce((allTowns, division) => {
//           division.districts.forEach((district) => {
//             allTowns.push(...district.towns);
//           });
//           return allTowns;
//         }, []);

//         setAllTownNames(towns);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchLocationData();
//   }, []);
//   return allTownNames;
// };

// export default useAllTowns;
