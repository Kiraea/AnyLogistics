<script setup>
    import { ref, onMounted } from 'vue';

    let users = ref({})

    onMounted(async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL_LINK}/users/getAllUsers`)
        const data = await response.json()

        console.log(data.data)
        users.value = data.data

    } catch (error) {
        console.log(error)
    }
})
</script>

<template>

    <div v-if="users.length > 0">
        <h2>Users List</h2>
        <ul>
            <!-- <li v-for="user in users" :key="user.id">{{ user.name }}</li> -->
             <li v-for="user in users" :key="user.id">{{ user.username }}</li>
        </ul>
    </div>
    <p v-else>Loading users...</p>

    <div class="py-8">
        <div name="filters">
            <button class="mx-2">All</button>
            <button class="mx-2">Admins</button>
            <button class="mx-2">Clients</button>
            <button class="mx-2">Couriers</button>
        </div>

        <table class="w-full text-sm text-left rtl:text-right table-auto border border-gray-300">
            <thead class="border-b border-gray-500">
                <tr>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Username</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">User Type</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Company</th>
                    <th scope="col" class="px-6 py-3 border border-gray-500">Email</th>
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