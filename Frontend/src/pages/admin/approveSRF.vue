<script setup>
    import HeaderX from "../../components/HeaderX.vue";
    import AdminNav from '@/components/AdminNav.vue';
</script>

<template>
    <HeaderX/>
    <h1> approve srf !</h1>
    <div class="py-8">

        <table class="w-full text-sm text-left rtl:text-right table-auto border border-gray-300">
            <thead class="border-b border-gray-500">
                <tr>
                    <th scope="col" class="px-6 py-3 border border-gray-500"></th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Company</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Point of Origin</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Destination</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Inventory</th> <!--Dropdown that lists the items-->
                    <th scope="col" class="px-6 py-3 border border-gray-500">Requesting User</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Date of Request</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id" class="border-b border-gray-300">
                    <td class="px-6 py-3 border border-gray-500">{{ user.username }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ user.company_id }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ user.company_id }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ user.email }}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>