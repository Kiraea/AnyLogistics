<script setup>
 import { ref } from 'vue';
 import { useGetUserPublicInformation } from '@/Queries';
import HeaderX from '@/components/HeaderX.vue';
import UpdateProfile from '@/components/UpdateProfile.vue';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '@/stores/auth';
const {data: userData = [], isLoading:userIsLoading, isError: userIsError, error: userError} = useGetUserPublicInformation();

const firstName = ref("")
const lastName= ref("")
const email = ref("")
const phoneNumber = ref("")
const companyName = ref("")

const router = useRouter()


const authStore = useAuthStore()



let role = ref("")
let assignedCity = ref("")
let maxCapacity = ref(-1)
let vehicleType = ref("")
let vehicleId= ref(-1)


watchEffect(() => {
    if (userData.value && userData.value.length > 0) {
        firstName.value = userData.value[0].first_name;
        lastName.value = userData.value[0].last_name;
        email.value = userData.value[0].email;
        phoneNumber.value = userData.value[0].phone_number;
        companyName.value = userData.value[0].company_name;

        if (userData.value[0].vehicle_city_id){
            assignedCity.value = userData.value[0].vehicle_city_name;
            maxCapacity.value = userData.value[0].max_capacity_kg;
            vehicleType.value = userData.value[0].vehicle_type;
            vehicleId.value = userData.value[0].vehicle_id;
        }
    }
});

const isUpdateProfileOpen = ref(false);

const closeUpdateProfileModal = () => {
    isUpdateProfileOpen.value = false
}

const handleBackLogic = () => {
    router.go(-1)
}   

</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-white box-border gap-5" >


        <HeaderX/>

        <div>
            <button @click="handleBackLogic" class="rounded-2xl bg-blue-600 ml-5"><Icon icon="mingcute:left-fill" style="color:white; width:30px; height:30px"/></button>
        </div>
        <div>
            <button @click="isUpdateProfileOpen = true" class="bg-blue-400 ml-5 p-2 rounded-2xl">UpdateProfile</button>
        </div>

        <UpdateProfile :isOpen="isUpdateProfileOpen" :firstName="firstName" :lastName="lastName" :email="email" :phoneNumber="phoneNumber" @close="closeUpdateProfileModal"/>


        <div v-if="userData.length > 0" class="bg-blue-300 flex flex-col gap-2 mx-5 p-5 rounded-2xl">
            <h1 class="font-bold text-2xl">User Information</h1>
            <div class="flex flex-col gap-1">
                <div><span class="font-bold">First Name: </span> {{  firstName }}</div>
                <div><span class="font-bold">Last Name:  </span>{{ lastName }}</div>
                <div><span class="font-bold">Email: </span>{{ email }}</div>
                <div><span class="font-bold">Phone Number: </span>{{ phoneNumber }}</div>
                <div><span class="font-bold">Company Affiliated:</span> {{ companyName }} </div>
            </div>

        </div>

        <!-- put code if  admin-->
        <div v-if="authStore.companyName === 'AnyLogisticsA'" class="gap-5 flex flex-col p-5 bg-blue-300 mx-5">

            <span>Role: Admin</span>
            <span></span>
            <span></span>
            <span></span>
        </div>
            <!-- put code if  courier-->
        <div v-if="authStore.companyName === 'AnyLogisticsB'"  class="gap-5 flex flex-col p-5 mx-5 bg-blue-300 rounded-2xl" >
            <span><span class="font-bold">Role: </span>Courier</span>
            <span><span class="font-bold">Vehicle ID:</span>  {{ vehicleId }}</span>
            <span><span class="font-bold">Vehicle Type:</span>  {{  vehicleType }}</span>
            <span><span class="font-bold">Max Capacity: </span> {{  maxCapacity }}</span>
            <span><span class="font-bold">Assigned City:</span> {{ assignedCity }}</span>
        </div>

        <!-- put code if  client-->
        <div v-if="authStore.companyName !== 'AnyLogisticsA' && authStore.companyName !== 'AnyLogisticsB'" class="gap-5 flex flex-col p-5 bg-blue-300 mx-5 rounded-2xl">
            <span>Role: Client</span>

        </div>

    </div>

    
</template>