<script setup>

    import { onMounted } from 'vue';
    import axios, { AxiosError } from 'axios';

import { ref } from 'vue';
import { useGetCities } from '@/Queries';
import { useAddVehicle } from '@/Queries';
    const {useAddVehicleAsync} = useAddVehicle()

    // locations variable
    let vehicleType = ref("");
    let cityID= ref(-1)

    const {data: citiesData= [], isLoading: citiesIsLoading, isError: citiesIsError, error: citiesError} = useGetCities()




    const handleAddVehicle = async () => {
        console.log(vehicleType.value)
        console.log(cityID.value)
        if (vehicleType.value === ""  && cityID.value === -1 ){
            console.log("failed to add location");
            return;
        }

        await useAddVehicleAsync({vehicleType: vehicleType.value,cityID:  cityID.value});

    }

    let options = ["light", "medium", "heavy"]

</script>

<template>
    <div  class="  flex ">
        <div class=" bg-white p-5 rounded-2xl ">
            <form class="flex flex-col p-5 gap-5" @submit.prevent="handleAddVehicle">
                <label class="font-bold">VehicleType</label>
                <select v-model="vehicleType" class="border-black border-[1px]">
                    <option v-for="(option) in options" :key="option" :value="option">{{ option }}</option>
                </select>


                <label class="font-bold">City ID</label>
                <select v-model="cityID" class="border-black border-[1px]">
                    <option v-for="(city,index) in citiesData" :key="index" :value="city.id">{{ city.name }}</option>
                </select>
                <button type="submit" class="shadow-gray bg-blue-600 font-bold text-white p-1 ">Submit</button>
            </form>
        </div>
    </div>
</template>