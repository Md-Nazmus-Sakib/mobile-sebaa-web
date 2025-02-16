import React from 'react';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useSearchShop = () => {
    const axiosPublic = useAxiosPublic();
    const { data: shops = [], isPending: shopsLoading, refetch: shopsRefetch } = useQuery({
        queryKey: ['shops'],
        queryFn: async () => {
            const res = await axiosPublic.get('/shops');
            return res.data;
        }
    })

    return [shops, shopsLoading, shopsRefetch]
};


export default useSearchShop;