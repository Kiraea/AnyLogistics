<script setup>
import { useErrorStore } from '@/stores/error';

import { storeToRefs } from 'pinia';
    const store = useErrorStore()
    const { errorMessage } = storeToRefs(store)


</script>
<template> 
    <Teleport to="#error">
        <div v-if="errorMessage" class="fixed top-0 left-0 w-screen h-screen flex justify-end items-start p-5 pointer-events-none "> 
            <div class="relative bg-red-200 p-5 rounded-2xl shadow-md shadow-gray"> 
                <div class="">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </Teleport>

</template>