import { Helmet } from "react-helmet-async";

// eslint-disable-next-line react/prop-types
const HelmetComponent = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default HelmetComponent;
