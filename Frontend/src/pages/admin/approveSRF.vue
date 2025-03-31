<script setup>
    import HeaderX from "../../components/HeaderX.vue";
    import { useGetPendingShippingForm } from "@/Queries";
    import { useUpdateStatusFormInAdmin } from "@/Queries";
    const {data: srfData = [], isLoading:userIsLoading, isError: userIsError, error: userError} = useGetPendingShippingForm();
    const {useUpdateStatusFormInAdminAsync} = useUpdateStatusFormInAdmin()

    async function updateStatus(formId, newStatus){
        await useUpdateStatusFormInAdminAsync({formId: formId, newStatus: newStatus})

        if (newStatus === 'ready for pickup'){
            //call another js function
        }
    }
</script>

<template>
    <HeaderX/>
    <div class="py-8 px-8">
        <h1 class="font-bold">Pending Shipping Forms</h1>
        <table class="w-full text-sm text-left rtl:text-right table-auto">
            <thead class="bg-blue-300">
                <tr>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Company</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Point of Origin</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Destination</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Inventory</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Requesting User</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Date of Request</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(srf, index) in srfData" :class="['even:bg-blue-100 odd:bg-white', index === srfData.length - 1 ? 'border-b border-blue-200' : '']">
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.company_name }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.l_origin }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.lo_dest }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.inventory }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.first_name }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.formatted_date }}</td>
                    <td class="px-2 py-2 text-center border-x border-blue-200">
                        <div class="flex justify-center gap-2">
                            <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1" @click="updateStatus(srf.id, 'ready for pickup')">
                                Accept
                            </button>
                            <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1" @click="updateStatus(srf.id, 'declined')">
                                Reject
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>



    </div>
</template>