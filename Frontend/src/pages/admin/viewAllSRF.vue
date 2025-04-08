<script setup>
   


</script>
<template>
    <div class="flex flex-col gap-5">
        <div class="font-bold text-4xl">All Shipping Forms</div> 
        <table class="w-full border-collapse border border-black">
            <thead>
                <tr class="bg-gray-200">
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Requestor</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Weight</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Status </th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Inventory</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Created At</th>


                    <th class="p-2  text-center  border border-gray-500">City To</th>
                    <th class="p-2  text-center  border border-gray-500">City From</th>
                    <th class="p-2  text-center  border border-gray-500">Location To</th>
                    <th class="p-2  text-center  border border-gray-500">Location From</th>


                    <th class="p-2  text-center  border border-gray-500">Courier Name (Delivery)</th>
                    <th class="p-2  text-center  border border-gray-500">Courier Name (Pickup)</th>




                </tr>
            </thead>
            <tbody>
                <tr v-for="user in unverifiedUsersData" :key="user.id" class=" border-black">


                    <td class="p-2 text-center border border-gray-500">{{ user.client}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.weight}}</td>
                    <td class="p-2  text-center  border border-gray-500">{{ user.status}}</td>
                    <td class="p-2   text-center border border-gray-500">{{ user.inventory}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.created at}}</td>

                    <td class="p-2  text-center border border-gray-500">{{ user.city_from_name}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.city_to_name}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.location_to_address}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.location_from_address}}</td>

                    <td class="p-2  text-center border border-gray-500">{{ user.user_to_courier}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.user_from_courier}}</td>
                </tr>
            </tbody>
        </table>

    </div>
   

</template>