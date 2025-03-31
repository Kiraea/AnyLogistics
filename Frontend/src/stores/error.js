import {ref, computed, onMounted} from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '@/AxiosInstance';

export const useErrorStore = defineStore('error', () => {
    const errorMessage = ref("");


    // clear error message every 5 seconds
    setInterval(() => {
        errorMessage.value = ""
     }, 5000);

     console.log(errorMessage, "error message");
    return {
        errorMessage
    }
} )