import { useQuery } from "@tanstack/react-query";

import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/role/${user?.email}`)
            return res.data.admin;
        }
    })
    return [isAdmin, isAdminLoading]
};

export default useAdmin;