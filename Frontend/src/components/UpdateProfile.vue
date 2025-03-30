<script setup>

    import { Teleport } from 'vue';
    import { ref } from 'vue';
    import { defineEmits } from 'vue';
    import { onMounted } from 'vue';
    import axios, { AxiosError } from 'axios';
    import { useUpdateUserPhoneAndEmail } from '@/Queries';

    const props = defineProps(
        {isOpen: Boolean, firstName: String, lastName: String, email: String, phoneNumber: String})
    const emit = defineEmits(['close']);

    const {useUpdateUserPhoneAndEmailAsync} = useUpdateUserPhoneAndEmail()


    const firstName = ref(props.firstName)
    const lastName= ref(props.lastName)
    const email = ref(props.email)
    const phoneNumber = ref(props.phoneNumber)

    
    const closeModal = () => {
        emit('close');
    }

    const handleUpdateProfile = async () => {
        console.log("updating profile");
        await useUpdateUserPhoneAndEmailAsync({email: email.value, phoneNumber: phoneNumber.value})
    }
</script>

<template>
        <Teleport to="#modal">
            <div v-if="isOpen" class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
                <div class="relative bg-white p-5 rounded-2xl shadow-md shadow-gray">

                    <button class="relative top-0 right-0 text-black  rounded-full" @click="closeModal">X</button>
                    <form class="flex flex-col p-5 gap-5" @submit.prevent="handleUpdateProfile">


                        <label class="font-bold">First Name <span class="text-gray-500">(Unchangeable)</span></label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" readonly  v-model="firstName" > 


                    <label class="font-bold">Last Name <span class="text-gray-500">(Unchangeable)</span> </label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" reaonly v-model="lastName" > 


                        <label class="font-bold">Email</label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" v-model="email" > 


                        <label class="font-bold">Phone Number</label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2"  v-model="phoneNumber" > 




                        <button type="submit" class="shadow-gray shadow-md p-1">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>
</template>