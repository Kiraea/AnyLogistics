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




export const useGetClientShippingForm = () => {
    console.log("TEST route");
    return useQuery({
        queryKey: [`clientShippingForm`],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm`)
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
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/location/locationsById`)
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



export const addlocation =  async ({name, address, cityId}) => {
    try {
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/location`, {
            name: name.value,
            address: address.value, 
            cityId: cityId.value
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


export const useAddLocation = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useAddlocationAsync} = useMutation({
        mutationFn: addlocation,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["locations"]})
    })
    return {useAddlocationAsync}
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
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["clientShippingForm"]})
    })
    return {useAddShippingFormAsync}
}




export const useGetUserPublicInformation= () => { 
    return useQuery({
        queryKey: ['userInformation'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/users/getPublicInformationOfUser`)
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

export const updateUserPhoneAndEmail = async ({email, phoneNumber}) => {
    try {
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/users/updateEmailAndPhone`, {
            email: email,
            phoneNumber: phoneNumber
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

export const useUpdateUserPhoneAndEmail = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useUpdateUserPhoneAndEmailAsync} = useMutation({
        mutationFn: updateUserPhoneAndEmail,
        onSuccess: () => {queryClient.invalidateQueries({queryKey: ['userInformation']})}
    })
    return {useUpdateUserPhoneAndEmailAsync}

}


export const useGetShippingFormVehicleId = () => {
    return useQuery({
        queryKey: ['shippingFormVehicleId'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/getShippingFormByVehicleId`)
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