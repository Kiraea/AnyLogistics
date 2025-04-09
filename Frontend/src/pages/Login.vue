<script setup>
    import {ref} from "vue";
    import { axiosInstance } from "@/AxiosInstance";
    import { useAuthStore } from "@/stores/auth";
    import { storeToRefs } from "pinia";
    import { useRouter } from "vue-router";
    import HeaderX from "../components/HeaderX.vue"
    import { RouterView } from "vue-router";
    import { onMounted } from "vue";
    import { useQueryClient } from "@tanstack/vue-query";
    import error from "@/components/error.vue";
    import { useErrorStore } from "@/stores/error";

    const store = useErrorStore()
    const { errorMessage } = storeToRefs(store)



    const queryClient = useQueryClient()

    onMounted(()=> {
        queryClient.clear();
    })


    const username = ref("");
    const password = ref("");
    const router = useRouter()
    const authStore = useAuthStore()

    const {  isLoggedIn, isLoading, companyName} = storeToRefs(authStore); // cause reactive
    const { setCompanyName , setIsLoading, setIsLoggedIn } = authStore; // cause functions
    const handleLogin = async () => { 
        try{
            let result = await axiosInstance.post(`http://localhost:3000/api/users/login`, {
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
            errorMessage.value = e.response?.data?.message;
        }

    }

</script>

<template>
    <HeaderX/>
    <div class="min-h-screen flex flex-col text-black bg-blue-200 box-border">
        <div class="flex-grow flex flex-row justify-center items-center rounded-2xl">
            <div class="bg-white rounded-2xl flex flex-row shadow-[#454545] shadow-2xl">
                <div>
                    <form class="p-5 flex flex-col gap-5" @submit.prevent="handleLogin">
                        <label>Username</label>
                        <input type="text"  name="username" class=" border-black border-[1px]" v-model="username" > 
                        <label>Password</label>
                        <input type="password" name="password" class="bg-white border-black border-[1px]" v-model="password">
                        <div>Don't have an account yet? <RouterLink to="/register" class="font-bold bg-blue-300 p-2 rounded-2xl">Click Here!</RouterLink></div>
                        <button type="submit" class="bg-blue-400 p-2 rounded-2xl">Submit</button>
                    </form>
                </div>
                <div class="bg-white rounded-r-2xl">
                    <img class="rounded-r-2xl" 
                    src="https://media.istockphoto.com/id/859916128/photo/truck-driving-on-the-asphalt-road-in-rural-landscape-at-sunset-with-dark-clouds.jpg?s=612x612&w=0&k=20&c=tGF2NgJP_Y_vVtp4RWvFbRUexfDeq5Qrkjc4YQlUdKc=">
                </div>
            </div>

            
        </div>
        <error/>
        
    </div>

    
</template>
