<script setup>
    import {ref} from "vue";
    import { axiosInstance } from "@/AxiosInstance";
    import { useAuthStore } from "@/stores/auth";
    import { storeToRefs } from "pinia";
    import { useRouter } from "vue-router";
    import HeaderX from "../components/HeaderX.vue"
    const username = ref("");
    const password = ref("");
    const router = useRouter()
    const authStore = useAuthStore()

    const {  isLoggedIn, isLoading, companyName} = storeToRefs(authStore); // cause reactive
    const { setCompanyName , setIsLoading, setIsLoggedIn } = authStore; // cause functions
    const handleLogin = async () => { 
        try{
            let result = await axiosInstance.post(`/login`, {
                username: username.value,
                password: password.value
            });
            if (result.status === 200){
                let data = result.data.data
                setCompanyName(data.companyName);
                setIsLoggedIn(true);
                setIsLoading(false);
                console.log(data.companyName + "company name");
                if (data.companyName === "AnyLogisticsA"){
                    router.push('/admin')
                }else if (data.companyName === "AnyLogisticsB"){
                    router.push('/courier')
                }else{
                    router.push('/client')
                }
            }
        }catch(e){
            console.log(e);
        }

    }

</script>

<template>

    <div class="min-h-screen flex flex-col text-black bg-cyan-100 box-border">
        <HeaderX/>
        <div class="flex-grow flex flex-col justify-center items-center rounded-2xl">
            <div class="bg-blue-200">
                <form class="p-5 flex flex-col gap-5" @submit.prevent="handleLogin">
                    <label>Username</label>
                    <input type="text"  name="username" class="bg-white" v-model="username" > 
                    <label>Password</label>
                    <input type="password" name="password" class="bg-white" v-model="password">
                    <div>Don't have an account yet? <RouterLink to="/register" class="font-bold">Click Here!</RouterLink></div>
                    <button type="submit" class="bg-white">Submit</button>
                </form>
            </div>

        </div>

    </div>

    
</template>
