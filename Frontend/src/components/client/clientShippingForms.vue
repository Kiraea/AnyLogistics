<script setup>
    import { useGetClientShippingForm } from '@/Queries';

    
    const {data: shippingFormData, isLoading:shippingFormIsLoading, error:shippingFormError, isError:shippingFormIsError} = useGetClientShippingForm();
    if(!shippingFormIsLoading){
        console.log(shippingFormData[0].created_at);
    }
</script>

<template>

<table class="w-full text-sm text-left rtl:text-right table-auto">
    <thead>
        <tr class="bg-blue-300">
            <th class="px-6 py-3 border-x border-blue-200">Shipping Reference ID</th>
            <th class="px-6 py-3 border-x border-blue-200">Weight (KG)</th>
            <th class="px-6 py-3 border-x border-blue-200">Date of<br>Request</th>
            <th class="px-6 py-3 border-x border-blue-200">Status</th>
            <th class="px-6 py-3 border-x border-blue-200">Point of Origin</th>

            <th class="px-6 py-3 border-x border-blue-200">Courier to Pickup</th>
            <th class="px-6 py-3 border-x border-blue-200">Phone Number of<br>Pickup Courier</th>
            <th class="px-6 py-3 border-x border-blue-200">Destination</th>
            <th class="px-6 py-3 border-x border-blue-200">Courier to Deliver to Destinaton</th>
            <th class="px-6 py-3 border-x border-blue-200">Phone Number of<br>Pickup Destination</th>

            <th class="px-6 py-3 border-x border-blue-200">Inventory</th>


        </tr>
    </thead>
    <tbody>
        <tr 
            v-for="(shippingForm, index) in shippingFormData" 
            :key="shippingForm.id" 
            :class="{
            'bg-blue-100': index % 2 === 0,
            'bg-white': index % 2 !== 0,
            'border-b border-blue-200': index === shippingFormData.length - 1
            }"
        >
        
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.id }}</td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.weight }}KG</td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.formatteddate }}</td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.status }}</td>
            <td class="px-6 py-3 border-x border-blue-200">
                <span>{{ shippingForm.from_location_name }} </span><br/>
                <span>{{ shippingForm.from_location_address }} </span><br/>
                <span>{{ shippingForm.from_city_name}} </span>
            </td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.vehicle_from_last_name }}</td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.vehicle_from_phone_number}}</td>

            <td class="px-6 py-3 border-x border-blue-200 ">
                <span>{{ shippingForm.to_location_name }} </span><br/>
                <span>{{ shippingForm.to_location_address }} </span><br/>
                <span>{{ shippingForm.to_city_name}} </span>
            </td>

            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.vehicle_to_last_name}}</td>
            <td class="px-6 py-3 border-x border-blue-200">{{ shippingForm.vehicle_to_phone_number}}</td>

            <td class="px-6 py-3 border-x border-blue-200">
                <ul>
                    <li v-for="(item, index) in shippingForm.inventory" :key="index">• {{ item }}</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

    
</template>