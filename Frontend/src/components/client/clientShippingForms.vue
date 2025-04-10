<script setup>
    import { useGetClientShippingForm } from '@/Queries';

    
    const {data: shippingFormData, isLoading:shippingFormIsLoading, error:shippingFormError, isError:shippingFormIsError} = useGetClientShippingForm();
    if(!shippingFormIsLoading){
        console.log(shippingFormData[0].created_at);
    }
</script>

<template>

<table class="border-collapse border border-black w-full">
    <thead>
        <tr class="bg-gray-200">
            <th class="border border-black p-2">Shipping Reference ID</th>
            <th class="border border-black p-2">Weight</th>
            <th class="border border-black p-2">Created At</th>
            <th class="border border-black p-2">Status</th>
            <th class="border border-black p-2">Point of Origin</th>

            <th class="border border-black p-2">Courier to Pickup</th>
            <th class="border border-black p-2">Phone Number Of Pickup Courier</th>
            <th class="border border-black p-2">Destination</th>
            <th class="border border-black p-2">Courier to Deliver to Destinaton</th>
            <th class="border border-black p-2">Phone Number of Pickup Destination</th>

            <th class="border border-black p-2">Inventory</th>


        </tr>
    </thead>
    <tbody>
        <tr v-for="shippingForm in shippingFormData" :key="shippingForm.id" class="border border-black">
            <td class="border border-black p-2">{{ shippingForm.id }}</td>
            <td class="border border-black p-2">{{ shippingForm.weight }}KG</td>
            <td class="border border-black p-2">{{ shippingForm.formatteddate }}</td>
            <td class="border border-black p-2">{{ shippingForm.status }}</td>
            <td class="border border-black p-2">
                <span>{{ shippingForm.from_location_name }} </span><br/>
                <span>{{ shippingForm.from_location_address }} </span><br/>
                <span>{{ shippingForm.from_city_name}} </span>
            </td>
            <td class="border border-black p-2">{{ shippingForm.vehicle_from_last_name }}</td>
            <td class="border border-black p-2">{{ shippingForm.vehicle_from_phone_number}}</td>

            <td class="border border-black p-2 ">
                <span>{{ shippingForm.to_location_name }} </span><br/>
                <span>{{ shippingForm.to_location_address }} </span><br/>
                <span>{{ shippingForm.to_city_name}} </span>
            </td>

            <td class="border border-black p-2">{{ shippingForm.vehicle_to_last_name}}</td>
            <td class="border border-black p-2">{{ shippingForm.vehicle_to_phone_number}}</td>

            <td class="border border-black p-2">
                <ul>
                    <li v-for="(item, index) in shippingForm.inventory" :key="index">• {{ item }}</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

    
</template>