<script setup>

    import { onMounted } from 'vue';
    import axios, { AxiosError } from 'axios';


    // locations variable
    let vehicleType = ref("");
    let cityID= ref(-1)

    onMounted(()=> {
        const getCities = async () => {
            try{
                let result = await axios.get(`${import.meta.env.VITE_BASE_URL_LINK}/city`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    cities.value = result.data.data
                }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
        }
        getCities()
    })


    const handleAddVehicle = async () => {
        if (vehicleType.value === ""  && cityID.value === -1 ){
            console.log("failed to add location");
            return;
        }
        console.log(vehicleType.value)
        console.log(cityID.value)
    }

</script>

<template>
    <div v-if="isOpen" class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <div class="relative bg-white p-5 rounded-2xl shadow-md shadow-gray">
            <form class="flex flex-col p-5 gap-5" @submit.prevent="handleAddVehicle">
                <label class="font-bold">VehicleType</label>
                <input type="text" class="border-black border-2 rounded-2xl p-2" name="vehicleType" v-model="vehicleType" > 
                <label>City ID</label>
                <select v-model="cityId">
                    <option v-for="(city,index) in cities" :key="index" :value="city.id">{{ city.name }}</option>
                </select>

                <button type="submit" class="shadow-gray shadow-md p-1">Submit</button>
            </form>
        </div>
    </div>
</template>