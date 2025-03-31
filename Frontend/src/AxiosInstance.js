import axios from "axios";
import { useErrorStore } from "./stores/error";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_LINK, 
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
  });


// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {

  const errorStore = useErrorStore();

  errorStore.$patch({
    error: error.response?.data?.message || "Unexpected Error Occured"
  })
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});




export const axiosInstance = instance 