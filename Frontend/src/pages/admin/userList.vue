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
   <!-- <li v-for="user in users" :key="user.id">{{ user.name }}</li> -->
    <!--
    <div v-if="users.length > 0">
        <h2>Users List</h2>
        <ul>
         
             <li v-for="user in users" :key="user.id">{{ user.username }}</li>
        </ul>
    </div>
    <p v-else>Loading users...</p>

    -->
    <div class="py-8 px-4">


        <table class="w-full text-sm text-left rtl:text-right table-auto">
            <thead class="bg-blue-300">
                <tr>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Username</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Account Type</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Company</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">First Name</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Last Name</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Email</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Phone Number</th>
                </tr>
            </thead>
            <tbody>
            <tr 
                v-for="(user, index) in users" 
                :key="user.id" 
                :class="{
                'bg-blue-100': index % 2 === 0,
                'bg-white': index % 2 !== 0,
                'border-b border-blue-200': index === users.length - 1
                }"
            >
                <td class="px-6 py-3 border-x border-blue-200">{{ user.username }}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.company_id == 1 ? 'Admin' : user.company_id == 2 ? 'Courier' : 'Client'}}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.company_name }}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.first_name }}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.last_name }}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.email }}</td>
                <td class="px-6 py-3 border-x border-blue-200">{{ user.phone_number }}</td>
            </tr>
            </tbody>
        </table>

    </div>
</template>