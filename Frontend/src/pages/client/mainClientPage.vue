<script setup>

    import { Teleport } from 'vue';
    import { ref } from 'vue';
    import {useGetLocations, useAddShippingForm, useGetClientShippingForm } from '../../Queries.js';
    const weight = ref(-1)
    const shippingTo = ref("")
    const shippingFrom = ref(-1) // location ID


    const {useAddShippingFormAsync} = useAddShippingForm();

    const {data: locationsData, isLoading:locationsIsLoading, error:locationsError, isError:locationsIsError} = useGetLocations();
    const {data: shippingFormData, isLoading:shippingFormIsLoading, error:shippingFormError, isError:shippingFormIsError} = useGetClientShippingForm();
    console.log(locationsData, "locationsData");
    const inventory = ref(['']);

    const addItem = () => {
        inventory.value.push("");
    }
    const removeItem = (index) => {
        inventory.value.splice(index, 1);
    }
    if (!isLoading){
        for (let A of shippingFormData.value){
            console.log(A.weight);
            console.log(A.formattedDate);
        }
    }


    const isAddRequestFormOpen = ref(false);

    const openAddRFModal = () => {
        isAddRequestFormOpen.value = true;
    }
    const closeAddRFModal = () => {
        isAddRequestFormOpen.value = false;
    }


    const handleShippingForm = async () => {
        console.log("weight: " + weight.value, "shippingTo: ", shippingTo.value, "shipingFrom: ", shippingFrom.value);
        for (let item of inventory.value){
            console.log(item);
        }

        if (weight.value < 1 || status.value === "" || shippingTo.value === "" || shippingFrom.value === "" || inventory.value.length < 1){
            console.log("incomplete fields");
            return;
        }
        console.log('ABC');
        await useAddShippingFormAsync({weight, inventory, shippingFrom, shippingTo})
    }
</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-white box-border gap-5">
        <div>
            <button class="bg-cyan-100 rounded-2xl p-2" @click="openAddRFModal">Request Shipping Form</button>
        </div>
        <div class="grid grid-cols-4 gap-4">
            <div v-for="shippingForm in shippingFormData" class="shadow-gray shadow-xl border-2 border-black">
                <div> Weight: {{ shippingForm.weight }}</div>
                <div> Status: {{ shippingForm.status}}</div>
                <div> Inventory: {{ shippingForm.inventory}}</div>
                <div> Created At: {{ shippingForm.formattedDate}}</div>
            </div>
        </div>

        <Teleport to="#modal">
            <div class="fixed top-0 left-0 w-screen h-screen flex items-center justify-center" v-if="isAddRequestFormOpen">
                <div class="relative bg-white p-5 rounded-2xl shadow-md shadow-gray">

                    <button class="relative top-0 right-0 bg-black text-white" @click="closeAddRFModal">X</button>
                    <form class="flex flex-col p-5 gap-5" @submit.prevent="handleShippingForm">
                        <label>Weight (kg)</label>
                        <input type="number" class="bg-white" name="weight" v-model.number="weight" > 

                        <label>Inventory</label>
                        <div v-for="(item, index) in inventory" :key="index">
                            <input type="text" class="bg-white" placeholder="item name" v-model="inventory[index]">
                            <button @click="removeItem(index)" class="bg-gray-200">Remove</button>
                        </div>

                        <button @click="addItem" class="bg-gray-200">Add</button>

                        <label>shipping To</label>
                        <input type="text"  class="bg-white" name="shippingTo" v-model="shippingTo"> 


                        <label>Shipping From</label>
                        <!--  SHOULD CHANGE THE SELECT HERE to get the location data value and use it as an option-->
                        <select v-model="shippingFrom">
                            <option v-for="location in locationsData" :key="location.id" :value="location.id">{{ location.name }}</option>
                        </select>

                        <button type="submit" class="shadow-gray shadow-md p-1">Submit</button>
                    </form>
                </div>
            </div>
        </Teleport>
    </div>
</template>

