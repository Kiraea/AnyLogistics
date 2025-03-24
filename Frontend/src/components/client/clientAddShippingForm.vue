<script setup>

    import {useGetLocations, useAddShippingForm} from '../../Queries.js';
    import { Teleport } from 'vue';
    import { ref } from 'vue';

    import { defineEmits } from 'vue';


    const props = defineProps({isOpen: Boolean})
    const emit = defineEmits(['close']);

    let weight = ref(-1)
    let shippingTo = ref("")
    let shippingFrom = ref(-1) // location ID
    const {useAddShippingFormAsync} = useAddShippingForm();
    const {data: locationsData, isLoading:locationsIsLoading, error:locationsError, isError:locationsIsError} = useGetLocations();

    const inventory = ref(['']);

    const addItem = () => {
        inventory.value.push("");
    }
    const removeItem = (index) => {
        inventory.value.splice(index, 1);
    }

    const closeModal = () => {
        emit('close');
    }

    const handleShippingForm = async () => {
        console.log("weight: " + weight.value, "shippingTo: ", shippingTo.value, "shipingFrom: ", shippingFrom.value);
        for (let item of inventory.value){
            console.log(item);
        }

        if (weight.value < 1 || shippingTo.value === "" || shippingFrom.value === "" || inventory.value.length < 1){
            console.log("incomplete fields");
            return;
        }
        console.log('ABC');
        await useAddShippingFormAsync({weight, inventory, shippingFrom, shippingTo})
    }
</script>

<template>
        <Teleport to="#modal">
            <div v-if="isOpen" class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
                <div class="relative bg-white p-5 rounded-2xl shadow-md shadow-gray">

                    <button class="relative top-0 right-0 text-black  rounded-full" @click="closeModal">X</button>
                    <form class="flex flex-col p-5 gap-5" @submit.prevent="handleShippingForm">
                        <label class="font-bold">Weight (kg)</label>
                        <input type="number" class="border-black border-2 rounded-2xl p-2" name="weight" v-model.number="weight" > 

                        <label>Inventory</label>
                        <div v-for="(item, index) in inventory" :key="index" class="flex gap-2">
                            <input type="text" class="bg-white border-black border-2" placeholder="item name" v-model="inventory[index]">
                            <button @click="removeItem(index)" class="bg-gray-200 rounded-2xl p-2">Remove</button>
                        </div>

                        <button @click="addItem" class="bg-gray-200">Add</button>

                        <label>shipping To</label>
                        <input type="text" class="border-black border-2 rounded-2xl p-2" name="shippingTo" v-model="shippingTo"> 


                        <label>Shipping From</label>
                        <!--  SHOULD CHANGE THE SELECT HERE to get the location data value and use it as an option-->
                        <select v-model="shippingFrom" class="border-black border-2 rounded-2xl p-2">
                            <option v-for="location in locationsData" :key="location.id" :value="location.id">{{ location.name }}</option>
                        </select>

                        <button type="submit" class="shadow-gray shadow-md p-1">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>
</template>