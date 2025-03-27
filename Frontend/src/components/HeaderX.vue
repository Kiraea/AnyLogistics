<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { storeToRefs } from 'pinia';
    import { axiosInstance } from '@/AxiosInstance';
    import { AxiosError } from 'axios';
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';
    const authStore = useAuthStore()
    const {isLoggedIn} = storeToRefs(authStore)


    let firstName = ref("");
    let lastName = ref("");



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





    if (isLoggedIn.value){
        getPublicInfoOfUser()
    }

</script>

<template>
    <header class="w-full bg-blue-700 text-black flex p-5 justify-between">
        <span class="text-3xl font-bold text-white">Any<span class="text-white">Logistics</span></span>
            <div v-if="isLoggedIn" class="font-bold text-white">
                Welcome {{ firstName }}, {{ lastName }}
                <RouterLink to="/profile"> <button>Profile</button> </RouterLink>
            </div>
    </header>


</template>