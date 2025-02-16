import { useState, useEffect } from "react";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosPublic = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const requestInterceptor = axiosPublic.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      }
    );

    const responseInterceptor = axiosPublic.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPublic.interceptors.request.eject(requestInterceptor);
      axiosPublic.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return { axiosPublic, loading };
};

export default useAxiosPublic;
