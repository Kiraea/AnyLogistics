<script setup>
    import clientAddShippingForm from '@/components/client/clientAddShippingForm.vue';
    import HeaderX from '@/components/HeaderX.vue';
    import clientShippingForms from '../../components/client/clientShippingForms.vue'
    import { ref } from 'vue';
import ClientViewLocation from '@/components/client/clientViewLocation.vue';
import clientAddLocation from '@/components/client/clientAddLocation.vue';



    const isAddRequestFormOpen = ref(false);

    const openAddRFModal = () => {
        isAddRequestFormOpen.value = true;
    }
    const closeAddRFModal = () => {
        isAddRequestFormOpen.value = false;
    }


    const isAddLocationOpen = ref(false);
    const openAddLocationModal = () => {
        isAddLocationOpen.value = true;
    }
    const closeAddLocationModal = () => {
        isAddLocationOpen.value = false;
    }


</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-white box-border gap-5">

        <HeaderX/>
        <div class="flex flex-col gap-5 p-5">
            <div>
                <button class="bg-blue-400 rounded-2xl p-2 font-bold" @click="openAddRFModal">Request Shipping Form</button>
            </div>

            <clientAddShippingForm :isOpen="isAddRequestFormOpen" @close="closeAddRFModal"/>   <!-- use of @ when parent listens to an event in this case exit of the popup form-->
           
            <h2>Shipping Forms</h2>
            <clientShippingForms/>



            <div>
                <button class="bg-blue-400 rounded-2xl p-2 font-bold" @click="openAddLocationModal">Add Locations</button>
            </div>

            <ClientViewLocation/>


            <h2>Locations</h2>
            <clientAddLocation :isOpen="isAddLocationOpen" @close="closeAddLocationModal"/>


        </div>

    </div>
</template>

