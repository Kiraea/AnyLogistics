<script setup>
 import { ref } from 'vue';
 import { useGetUserPublicInformation } from '@/Queries';
import HeaderX from '@/components/HeaderX.vue';
import UpdateProfile from '@/components/UpdateProfile.vue';
import { watchEffect } from 'vue';

const {data: userData = [], isLoading:userIsLoading, isError: userIsError, error: userError} = useGetUserPublicInformation();

const firstName = ref("")
const lastName= ref("")
const email = ref("")
const phoneNumber = ref("")



watchEffect(() => {
    if (userData.value && userData.value.length > 0) {
        firstName.value = userData.value[0].first_name;
        lastName.value = userData.value[0].last_name;
        email.value = userData.value[0].email;
        phoneNumber.value = userData.value[0].phone_number;
    }
});

const isUpdateProfileOpen = ref(false);

const closeUpdateProfileModal = () => {
    isUpdateProfileOpen.value = false
}


</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-cyan-100 box-border gap-5" >
        <HeaderX/>
        <div>
            <button @click="isUpdateProfileOpen = true" class="bg-white">UpdateProfile</button>
        </div>

        <UpdateProfile :isOpen="isUpdateProfileOpen" :firstName="firstName" :lastName="lastName" :email="email" :phoneNumber="phoneNumber" @close="closeUpdateProfileModal"/>



        <div v-if="userData.length > 0" class="bg-white flex flex-col gap-2 mx-5 p-5 rounded-2xl">
            <h1 class="font-bold text-2xl">User Information</h1>
            <div class="flex flex-col gap-1">
                <div>First Name: {{ userData[0].first_name }}</div>
                <div>Last Name: {{ userData[0].last_name }}</div>
                <div>Email: {{ userData[0].email }}</div>
                <div>Phone Number: {{ userData[0].phone_number }}</div>
                <div>Company Name: {{ userData[0].company_name }}</div>
            </div>

        </div>

    </div>

    
</template>