import {ref, computed, onMounted} from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/AxiosInstance';

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(false);
    const isLoading = ref(true);
    const companyName = ref(null);

    function setIsLoggedIn(bool){
        isLoggedIn.value = bool
    }

    function setIsLoading(bool){
        isLoading.value = bool
    }
    function setCompanyName(newCompanyName){
        companyName.value = newCompanyName
    }



    const checkSessionToken = async () => {
        try {
            const result = await axiosInstance.post(`/users/checkSessionToken`)
            if (result.status === 200) {
                setIsLoading(false);
                setIsLoggedIn(true);
                setCompanyName(result.data.data.companyName);
            }
        } catch (error) {
            console.error('Session check failed:', error)
            isLoggedIn.value = false
            setIsLoading(false);
            setCompanyName(null);
        }
    }

    //basically runing initializeAuth
    const authReady = new Promise((resolve) => {
        checkSessionToken().finally(()=> resolve());
    })

    return {
        isLoggedIn,
        isLoading,
        companyName,
        setCompanyName,
        setIsLoading,
        setIsLoggedIn,
        authReady,
    }
} )