<script>
    
</script>

<template>
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
                <tr class="border-b border-gray-300">
                    <td class="px-6 py-3 border border-gray-500">Test</td>
                    <td class="px-6 py-3 border border-gray-500">Admin</td>
                    <td class="px-6 py-3 border border-gray-500">DLSU</td>
                    <td class="px-6 py-3 border border-gray-500">practicum.it@dlsu.edu.ph</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>