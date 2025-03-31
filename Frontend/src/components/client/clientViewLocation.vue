<script setup>
import { useGetLocations } from '@/Queries';
import { Icon } from "@iconify/vue";
    const {data: locationsData, isLoading: locationsIsLoading, isError: locationsIsError, error: locationsError} = useGetLocations();

    if (!locationsIsLoading){
        console.log(locationsData[0]);
    }
</script>


<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="location in locationsData" class=" border-black  border-2">
            <div class="flex items-center gap-2 bg-blue-400 justify-center">{{location.name}}</div>
            <div class="flex items-center gap-2 ml-2"><Icon icon="famicons:home-outline"/> {{location.address}}</div>
            <div class="flex items-center gap-2 ml-2"><Icon icon="mdi:home-city-outline"/> {{location.city_name}}</div>
        </div>
    </div>


</template>