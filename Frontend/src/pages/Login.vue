<script setup>
    import {ref} from "vue";
    import { axiosInstance } from "@/AxiosInstance";
    import { useAuthStore } from "@/stores/auth";
    import { storeToRefs } from "pinia";
    import { useRouter } from "vue-router";

    const username = ref("");
    const password = ref("");
    const router = useRouter()
    const authStore = useAuthStore()

    const {  isLoggedIn, isLoading, role } = storeToRefs(authStore); // cause reactive
    const { setRole, setIsLoading, setIsLoggedIn } = authStore; // cause functions

    const handleLogin = async () => { 
        try{
            let result = await axiosInstance.post(`/users/login`, {
                username: username.value,
                password: password.value
            });
            if (result.status === 200){
                let data = result.data.data
                setRole(data.roleName);
                setIsLoggedIn(true);
                setIsLoading(false);
                if (data.roleName === "clients"){
                    router.push('/client')
                }else if (data.roleName === "admins"){
                    router.push('/admin')
                }else if (data.roleName === "couriers"){
                    router.push('/courier')
                }
            }
        }catch(e){
            console.log(e);
        }

    }

</script>

<template>
    <form @submit.prevent="handleLogin">
        <label>Username</label>
        <input type="text" name="username" v-model="username" > 
        <label>Password</label>
        <input type="password" name="password" v-model="password">
        <button type="submit">AAA</button>
    </form>
    
</template>
