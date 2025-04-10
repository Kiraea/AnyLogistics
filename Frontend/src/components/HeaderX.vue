<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { storeToRefs } from 'pinia';
    import { axiosInstance } from '@/AxiosInstance';
    import { AxiosError } from 'axios';
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
    import { Icon } from '@iconify/vue';
    import { useRouter } from 'vue-router';
    const authStore = useAuthStore()
    const {isLoggedIn} = storeToRefs(authStore)


    let firstName = ref("");
    let lastName = ref("");

    const router = useRouter()

    const getPublicInfoOfUser = async () => {
        try{
            let result = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL_LINK}/users/getPublicInformationOfUser`)
            if (result.status === 200){
                console.log(result.data);
                console.log("here")
                firstName.value  = result.data.data[0].first_name; 
                lastName.value = result.data.data[0].last_name;
            }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
    }
    console.log(isLoggedIn.value, "ISLOGGEDIN?");
    if (isLoggedIn.value){
        getPublicInfoOfUser()
    }


    const handleLogout = async () => {
    try {
        await axiosInstance.post('/users/logout');


        authStore.$patch({
            isLoggedIn: false,
            isLoading: false,
            companyName: null
        });


        router.replace('/login');
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

</script>

<template>
    <header class="w-full bg-blue-700 text-black flex p-2 justify-between items-center">

        <span class="text-3xl font-bold text-white ml-4">Any<span class="text-white">Logistics</span></span>

        <div v-if="isLoggedIn" class="items-center flex flex-col"> 
            <RouterLink class="flex flex-col items-center"to="/profile"> 
                <Icon icon="mingcute:user-4-line" style="width: 50px; height: 50px; color:white;"/>
                <span class="font-bold text-white text-md">Welcome: {{ firstName }}</span>
            </RouterLink>
             <button @click="handleLogout" class="font-semibold text-sm bg-blue-400 p-[5px] rounded-2xl">Logout</button>
        </div>



    </header>


</template>