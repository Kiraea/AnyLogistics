<script setup>

    import {useAddLocation} from '../../Queries.js';
    import { Teleport } from 'vue';
    import { ref } from 'vue';
    import { defineEmits } from 'vue';
    import { onMounted } from 'vue';
    import axios, { AxiosError } from 'axios';


    const {useAddlocationAsync} = useAddLocation();
    const props = defineProps({isOpen: Boolean})
    const emit = defineEmits(['close']);


    // locations variable
    let name = ref("")
    let address = ref("") 
    let cityId = ref(-1);




    const cities = ref([]);


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


    console.log(cities.value, "cities value");





    const closeModal = () => {
        emit('close');
    }

    const handleAddLocation = async () => {
        if (name.value === ""  && address.value === "" && cityId.value === -1){
            console.log("failed to add location");
            return;
        } 
        useAddlocationAsync({name, address, cityId});
    }

</script>

<template>
        <Teleport to="#modal">
            <div v-if="isOpen" class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
                <div class="relative bg-white p-5 rounded-2xl shadow-md shadow-gray">

                    <button class="relative top-0 right-0 text-black  rounded-full" @click="closeModal">X</button>
                    <form class="flex flex-col p-5 gap-5" @submit.prevent="handleAddLocation">
                        <label class="font-bold">Name</label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" name="name" v-model="name" > 


                        <label>Address</label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" name="address" v-model="address"> 

                        <select v-model="cityId">
                            <option v-for="(city,index) in cities" :key="index" :value="city.id">{{ city.name }}</option>
                        </select>

                        <button type="submit" class="shadow-gray shadow-md p-1">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>
</template>