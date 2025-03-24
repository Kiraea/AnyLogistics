<script setup>
import { useGetLocations } from '@/Queries';
    const {data: locationsData, isLoading: locationsIsLoading, isError: locationsIsError, error: locationsError} = useGetLocations();

    if (!locationsIsLoading){
        console.log(locationsData[0]);
    }
</script>


<template>
    <div class="grid grid-cols-4">
        <div v-for="location in locationsData" class="flex flex-col border-black border-2">
            <span>Name: {{location.name}}</span>
            <span>Address: {{location.address}}</span>
            <span>City Name: {{location.city_name}}</span>
        </div>
    </div>


</template>