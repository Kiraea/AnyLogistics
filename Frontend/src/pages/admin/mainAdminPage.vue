<script setup>
import HeaderX from '@/components/HeaderX.vue';
import { RouterLink } from 'vue-router';

</script>


<template>
    <div class="min-h-screen flex flex-col text-black bg-white box-border gap-5">
        <HeaderX/>

        <div class="flex-grow flex">
            <div class="flex items-center justify-center flex-1/2">
                <RouterLink to="/admin/shippingForms"><button class="rounded-2xl bg-blue-400 text-black p-4 font-bold text-6xl">Shipping Forms</button></RouterLink>
            </div>


            <div class="flex items-center justify-center flex-1/2">
                <RouterLink to="/admin/accounts"> <button class="rounded-2xl bg-blue-400 text-black p-4 font-bold text-6xl">Accounts</button></RouterLink>
            </div>

        </div>



    </div>




</template>