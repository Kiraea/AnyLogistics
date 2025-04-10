<script setup>
    import { ref, onMounted } from 'vue';
    import { useGetVehicles } from '@/Queries';
    const {data: vehiclesData, isLoading: vehiclesIsLoading, isError: vehiclesIsError, error: vehiclesError} = useGetVehicles()





</script>

<template>
    <div class="py-4 px-4">
        <div class="font-bold text-4xl mb-4">Vehicles</div> 
        <table class="w-full text-sm text-left rtl:text-right table-auto border border-gray-300">
            <thead class="bg-blue-300">
                <tr>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">ID</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">User ID</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Courier Name</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">vehicle Type</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Max Capacity (KG)</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">City ID</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">City Name</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(vehicle, index) in vehiclesData" 
                    :key="vehicle.id" 
                    :class="{
                    'bg-blue-100': index % 2 === 0,
                    'bg-white': index % 2 !== 0,
                    'border-b border-blue-200': index === vehiclesData.length - 1
                    }"
                >
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.id}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.user_id}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.username}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.vehicle_type }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.max_capacity_kg}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.city_id}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ vehicle.city_name}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>