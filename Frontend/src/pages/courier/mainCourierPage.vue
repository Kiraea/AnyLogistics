<script setup>
    import { useGetShippingFormVehicleId } from '@/Queries';
    
    const {data: shippingFormVehicleData , isLoading: shippingFormVehicleIsLoading , isError: shippingFormVehicleIsError, error: shippingFormVehicleError } = useGetUnverifiedUsers();


    const options = ref([])


    const object = ref([
        {
            weight: "john",
            status: "john",
            inventory: "john",
            shipping_to: "john",
            name: "john",
        },

        //aa
        {
            weight: "john2",
            status: "john2",
            inventory: "john2",
            shipping_to: "john2",
            name: "john2",
        },
        {
            weight: "john2",
            status: "john2",
            inventory: "john2",
            shipping_to: "john2",
            name: "john2",
        }
    ])

</script>

<template>
    <div v-for="item in objects">
        {{ item.weight }}
        {{ item.status}}
        {{ item.inventory}}
        {{ item.shipping_to}}
        <select>
            <

        </select>
    </div>
</template>