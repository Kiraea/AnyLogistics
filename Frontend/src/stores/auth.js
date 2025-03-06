import {ref, computed, onMounted} from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/AxiosInstance';

export const useAuthStore = defineStore('auth', () => {
    const isLoggedIn = ref(false);
    const isLoading = ref(true);
    const role = ref(null);

    function setIsLoggedIn(bool){
        isLoggedIn.value = bool
    }

    function setIsLoading(bool){
        isLoading.value = bool
    }
    function setRole(newRole){
        role.value = newRole
    }



    const checkSessionToken = async () => {
        try {
            const result = await axiosInstance.post(`/users/checkSessionToken`)
            if (result.status === 200) {
                setIsLoading(false);
                setIsLoggedIn(true);
                setRole(result.data.data.roleName);
            }
        } catch (error) {
            console.error('Session check failed:', error)
            isLoggedIn.value = false
            setIsLoading(false);
            setRole(null);
        }
    }

    //basically runing initializeAuth
    const authReady = new Promise((resolve) => {
        checkSessionToken().finally(()=> resolve());
    })

    return {
        isLoggedIn,
        isLoading,
        role,
        setRole,
        setIsLoading,
        setIsLoggedIn,
        authReady,
    }
} )