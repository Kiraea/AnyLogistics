<script setup>
    import { ref, onMounted } from 'vue';
    import { useGetVehicles } from '@/Queries';
    const {data: vehiclesData, isLoading: vehiclesIsLoading, isError: vehiclesIsError, error: vehiclesError} = useGetVehicles()





</script>

<template>
    <div class="py-8">


        <table class="w-full text-sm text-left rtl:text-right table-auto border border-gray-300">
            <thead class="border-b border-gray-500">
                <tr>
                    <th scope="col" class="px-6 py-3 border border-gray-500">ID</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">User ID</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Courier Name</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">vehicle Type</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Max Capacity (KG)</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">City ID</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">City Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vehicle in vehiclesData" :key="vehicle.id" class="border-b border-gray-300">
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.id}}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.user_id}}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.username}}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.vehicle_type }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.max_capacity_kg}}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.city_id}}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ vehicle.city_name}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>