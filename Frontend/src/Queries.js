import { AxiosError } from "axios";
import { axiosInstance } from "./AxiosInstance";
import { useQuery } from "@tanstack/vue-query";
import { useQueryClient } from "@tanstack/vue-query";
import { useMutation } from "@tanstack/vue-query";

export const useGetUnverifiedUsers = () => { 
    return useQuery({
        queryKey: ['unverifiedUsers'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/users/unverifiedUsers`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
        }

    })
}

export const useGetLocations = () => {
    return useQuery({
        queryKey: ['locations'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/location`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
        }

    })
}

export const setValidationUser = async ({userId, validationStatus}) => {
        console.log(validationStatus, "queries");
        try {
            const response = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/users/updateValidation`, {
                userId: userId, 
                validationStatus:validationStatus
            });
            if (response.status === 200) {
                console.log("User validated:", userId);
            }
        } catch (error) {
            console.error("Error updating user validation:", error);
        }
    };


export const useSetValidationUser = () => {
    const queryClient = useQueryClient();
    const {mutateAsync: useSetValidationUserAsync} = useMutation({
        mutationFn: setValidationUser,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['unverifiedUsers']})
    })
    return {useSetValidationUserAsync};
}


export const useGetShippingForm = () => {
    return useQuery({
        queryKey: ['shippingForm'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/`)
                if (result.status === 200){
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
        }
    })
}



export const addShippingForm =  async ({ weight,  inventory, shippingFrom, shippingTo}) => {
    try {
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm`, {
            weight: weight.value,
            inventory: inventory.value,
            shippingFrom: shippingFrom.value, 
            shippingTo: shippingTo.value
        })
        if (result.status === 200){
            console.log(result.data.message , "message");
            return result.data.data            
        }
    }catch(e){
        console.log(e);
        if (e instanceof AxiosError){
            console.log(e)
        }
    }
}


export const useAddShippingForm = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useAddShippingFormAsync} = useMutation({
        mutationFn: addShippingForm,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["shippingForm"]})
    })
    return {useAddShippingFormAsync}
}