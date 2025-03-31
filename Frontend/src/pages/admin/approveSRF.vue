<script setup>
    import HeaderX from "../../components/HeaderX.vue";
    import { useGetPendingShippingForm } from "@/Queries";
    const {data: srfData = [], isLoading:userIsLoading, isError: userIsError, error: userError} = useGetPendingShippingForm();
    console.log(srfData)
</script>

<template>
    <HeaderX/>
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
                <tr v-for="srf in srfData" :key="user.id" class="border-b border-gray-300">
                    <td class="px-6 py-3 border border-gray-500">{{ srf.client_id }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ srf.shipping_from }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ srf.shipping_to }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ srf.inventory }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ srf.client_id }}</td>
                    <td class="px-6 py-3 border border-gray-500">{{ srf.created_at}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>