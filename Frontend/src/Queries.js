import { AxiosError } from "axios";
import { axiosInstance } from "./AxiosInstance";
import { useQuery } from "@tanstack/vue-query";
import { useQueryClient } from "@tanstack/vue-query";
import { useMutation } from "@tanstack/vue-query";
import { useErrorStore } from "./stores/error";





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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })
}



export const useGetVehicles= () => { 
    return useQuery({
        queryKey: ['vehicles'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/vehicle/`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })
}

export const addVehicle=  async ({vehicleType, cityID}) => {
    try {
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/vehicles`, {
            vehicleType : vehicleType,
            cityID: cityID
        })
        if (result.status === 200){
            console.log(result.data.message , "message");
            return result.data.data            
        }
    }catch(e){
        console.log(e);
        if (e instanceof AxiosError){
            console.log(e)
            const errorStore = useErrorStore()
            errorStore.errorMessage = e.response?.data?.message
        }
    }
}


export const useAddVehicle = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useAddVehicleAsync} = useMutation({
        mutationFn: addVehicle,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["vehicles"]})
    })
    return {useAddVehicleAsync}
}





export const useGetCities= () => { 
    return useQuery({
        queryKey: ['cities'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/city/`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })
}

export const addCity =  async ({city}) => {
    try {
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/city`, {
            city: city
        })
        if (result.status === 200){
            console.log(result.data.message , "message");
            return result.data.data            
        }
    }catch(e){
        console.log(e);
        if (e instanceof AxiosError){
            console.log(e)
            const errorStore = useErrorStore()
            errorStore.errorMessage = e.response?.data?.message
        }
    }
}


export const useAddCity = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useAddCityAsync} = useMutation({
        mutationFn: addCity,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["cities"]})
    })
    return {useAddCityAsync}
}





export const useGetAllUsers = () => { 
    return useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/getAllUsers`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })
}




export const useGetClientShippingForm = () => {
    return useQuery({
        queryKey: [`clientShippingForm`],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/shippingFormByUserId`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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
            const errorStore = useErrorStore()
            errorStore.errorMessage = e.response?.data?.message
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }
    })
}

export const useGetCompany= () => {
    return useQuery({
        queryKey: ['company'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/company/`)
                if (result.status === 200){
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }
    })
}







export const useGetPendingShippingForm = () => {
    return useQuery({
        queryKey: ['pendingShippingForm'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/pending`)
                if (result.status === 200){
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
        }
    }
}


export const useAddShippingForm = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useAddShippingFormAsync} = useMutation({
        mutationFn: addShippingForm,
        onSuccess: ()=> {
            
            queryClient.invalidateQueries({queryKey: ["clientShippingForm"]})
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdTo']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFrom']});





        }
        
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
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


export const useGetShippingFormVehicleIdFrom = () => {
    return useQuery({
        queryKey: ['shippingFormVehicleIdFrom'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/getShippingFormByVehicleIdFrom`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })    
}
export const useGetShippingFormVehicleIdTo = () => {
    return useQuery({
        queryKey: ['shippingFormVehicleIdTo'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/getShippingFormByVehicleIdTo`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })    
}

export const useCouriersGetPastTransactions = () => {
    return useQuery({
        queryKey: ['shippingFormVehicleIdFinished'],
        queryFn: async () => {
            try{
                let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/getShippingFormByVehicleIdFinished`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    return result.data.data
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                    const errorStore = useErrorStore()
                    errorStore.errorMessage = e.response?.data?.message
                }
            }
        }

    })      
}



export const updateStatusForm = async ({formId, newStatus}) => {
    console.log("new status: ", newStatus);
    try {
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/updateStatus`, {
            formId: formId,
            newStatus: newStatus
        })
        if (result.status === 200){
            console.log(result.data.message , "message");
            return result.data.data            
        }
    }catch(e){
        console.log(e);
        if (e instanceof AxiosError){
            console.log(e)
                    const errorStore = useErrorStore()
            errorStore.errorMessage = e.response?.data?.message
        }
    }    
}

export const useUpdateStatusForm = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useUpdateStatusFormAsync } = useMutation({
        mutationFn: updateStatusForm,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleId']})
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdTo']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFrom']});
            queryClient.invalidateQueries({queryKey: ['shippingForm']});
            queryClient.invalidateQueries({queryKey: ['clientShippingForm']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFinished']});
        }
    })
    return {useUpdateStatusFormAsync}

}

export const updateVehicleAssignment = async ({formId}) => {
    try {
        let result = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL_LINK}/assign/updateAssignToQualifiedDriver`, {     
            formId: formId
        })
        if (result.status === 200){
            console.log(result.data.message , "message");
            return result.data.data            
        }
    }catch(e){
        console.log(e);
        if (e instanceof AxiosError){
            console.log(e)
                    const errorStore = useErrorStore()
            errorStore.errorMessage = e.response?.data?.message
        }
    }    
}

export const useUpdateVehicleAssignment = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useUpdateVehicleAssignmentAsync } = useMutation({
        mutationFn: updateVehicleAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleId']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdTo']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFrom']});
            queryClient.invalidateQueries({queryKey: ['shippingForm']});
            queryClient.invalidateQueries({queryKey: ['clientShippingForm']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFinished']});
        }
    })
    return {useUpdateVehicleAssignmentAsync}

}



export const updateStatusFormInAdmin = async ({formId, newStatus}) => {
    try {
        let result = await axiosInstance.patch(`${import.meta.env.VITE_BASE_URL_LINK}/shippingForm/updateSRF`, {
            formId: formId,
            newStatus: newStatus
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

export const useUpdateStatusFormInAdmin = () => {
    const queryClient = useQueryClient()
    const {mutateAsync: useUpdateStatusFormInAdminAsync } = useMutation({
        mutationFn: updateStatusFormInAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleId']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdTo']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFrom']});
            queryClient.invalidateQueries({queryKey: ['shippingForm']});
            queryClient.invalidateQueries({queryKey: ['clientShippingForm']});
            queryClient.invalidateQueries({queryKey: ['pendingShippingForm']});
            queryClient.invalidateQueries({queryKey: ['shippingFormVehicleIdFinished']});
        }
    })
    return {useUpdateStatusFormInAdminAsync}

}
