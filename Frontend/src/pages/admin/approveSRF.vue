<script setup>
    import HeaderX from "../../components/HeaderX.vue";
    import { useGetPendingShippingForm } from "@/Queries";
    import { useUpdateStatusFormInAdmin } from "@/Queries";
    import { useUpdateVehicleAssignment } from "@/Queries";
    import { filtersForSRF } from "@/filters";
    import { ref } from "vue";
    import { computed } from "vue";


// THIS IS FOR FETCHI ALL SRF
     import { useGetShippingForm} from '../../Queries';
    const {data: shippingFormData = [], isLoading: shippingFormIsLoading , isError: shippingFormIsError, error: shippingFormError } = useGetShippingForm();
// -----------------


    let filter = ref("status");



    const {data: srfData = [], isLoading:userIsLoading, isError: userIsError, error: userError} = useGetPendingShippingForm();
    const {useUpdateStatusFormInAdminAsync} = useUpdateStatusFormInAdmin()
    const {useUpdateVehicleAssignmentAsync} = useUpdateVehicleAssignment()  

    const filteredSRFData = computed(() => {
        if (!Array.isArray(shippingFormData.value)) return []; 
        if ( shippingFormData.length === 0) return [];
        return filtersForSRF(shippingFormData.value, filter.value);
    });

    console.log(filteredSRFData.value);

    async function updateStatus(formId, newStatus){
        await useUpdateStatusFormInAdminAsync({formId: formId, newStatus: newStatus})

        if (newStatus === 'ready for pickup'){
            await useUpdateVehicleAssignmentAsync({formId: formId})
        }
    }


    const cancelSRF = async (formId, newStatus) =>{
        console.lo
        await useUpdateStatusFormInAdminAsync({formId: formId, newStatus: newStatus})
    }
</script>

<template>
    <div class="py-8 px-4">
        <!--
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
                    <td class="px-6 py-3 border-x border-blue-200">
                        <select>
                            <option disabled selected>View Inventory</option>
                            <option disabled v-for="item in srf.inventory">{{ item }}</option>
                        </select>
                    </td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.first_name }}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ srf.formatted_date }}</td>
                    <td class="px-2 py-2 text-center border-x border-blue-200">
                        <div class="flex justify-center gap-2">
                            <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1" @click="cancelSRF(srf.id, 'declined')">
                               Cancel Request 
                            </button>

                            <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1" @click="updateStatus(srf.id, 'ready for pickup')">
                               Approve
                            </button>



                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
-->

        <div class="font-bold text-4xl mt-12">All Shipping Forms</div>


        <select v-model="filter">
            <option value="requestor">requestor</option>
            <option value="created_at">created_at</option>
            <option value="status">status</option>
        </select>

        <table class="w-full border-collapse border border-black">
            <thead>
                <tr class="bg-gray-200">

                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Action</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Requestor</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Weight</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Status </th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Inventory</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Created At</th>


                    <th class="p-2  text-center  border border-gray-500">City From</th>
                    <th class="p-2  text-center  border border-gray-500">City To</th>

                    <th class="p-2  text-center  border border-gray-500">Location From</th>
                    <th class="p-2  text-center  border border-gray-500">Location To</th>
                    <th class="p-2  text-center  border border-gray-500">Vehicle From ID</th>
                    <th class="p-2  text-center  border border-gray-500">Vehicle To ID</th>

                    <th class="p-2  text-center  border border-gray-500">Courier Name (Delivery)</th>
                    <th class="p-2  text-center  border border-gray-500">Courier Name (Pickup)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eachSRF in filteredSRFData" :key="eachSRF.id" class=" border-black">
                    <td v-if="eachSRF.status === 'finished' || eachSRF.status === 'declined'" class="p-2 text-center border border-gray-500"></td>
                    <td v-else class="p-2 text-center border border-gray-500">  <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1" @click="cancelSRF(eachSRF.id, 'declined')">Cancel </button>   </td>
                    <td class="p-2 text-center border border-gray-500">{{ eachSRF.client}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.weight}}</td>
                    <td class="p-2  text-center  border border-gray-500">{{ eachSRF.status}}</td>
                    <td class="p-2 text-center border border-gray-500">
                        <select >
                            <option v-for="itemValue in eachSRF.inventory">{{ itemValue }}</option>
                        </select>
                    </td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.formatted_date}}</td>

                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.city_from_name}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.city_to_name}}</td>

                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.location_from_address}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.location_to_address}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.vehicle_from_id}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.vehicle_to_id}}</td>

                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.user_to_courier}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ eachSRF.user_from_courier}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>