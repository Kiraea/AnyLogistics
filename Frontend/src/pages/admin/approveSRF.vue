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
    <div class="py-4 px-4">
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

        <div class="flex flex-row mb-4 items-right">
            <div class="font-bold text-4xl">All Shipping Forms</div>
            <select v-model="filter" class="mx-4 rounded-md bg-blue-100 py-2 pl-2">
                <option value="requestor">requestor</option>
                <option value="created_at">created_at</option>
                <option value="status">status</option>
            </select>
        </div>

        <table class="w-full text-sm text-left rtl:text-right table-auto border border-gray-300">
            <thead>
                <tr class="bg-blue-300">

                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Action</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Requesting<br>Client</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Weight</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Status </th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Inventory</th>
                    <th scope="col" class="px-6 py-3 border-x border-blue-200">Date of<br>Request</th>


                    <th class="px-6 py-3 border-x border-blue-200">Originating<br>City</th>
                    <th class="px-6 py-3 border-x border-blue-200">Destination<br>City</th>

                    <th class="px-6 py-3 border-x border-blue-200">Originating<br>Location</th>
                    <th class="px-6 py-3 border-x border-blue-200">Destination<br>Location</th>
                    <th class="px-6 py-3 border-x border-blue-200">Pickup<br>Vehicle</th>
                    <th class="px-6 py-3 border-x border-blue-200">Delivery<br>Vehicle</th>

                    <th class="px-6 py-3 border-x border-blue-200">Courier Name (Pickup)</th>
                    <th class="px-6 py-3 border-x border-blue-200">Courier Name (Delivery)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eachSRF in filteredSRFData" :key="eachSRF.id" class=" border-black">
                    <td v-if="eachSRF.status === 'finished' || eachSRF.status === 'declined'" class="px-6 py-3 border-x border-blue-200"></td>
                    <td v-else class="px-6 py-3 border-x border-blue-200">  <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1" @click="cancelSRF(eachSRF.id, 'declined')">Cancel </button>   </td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.client}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.weight}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.status}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">
                        <select class="mx-4 rounded-md bg-blue-100">
                            <option v-for="itemValue in eachSRF.inventory">{{ itemValue }}</option>
                        </select>
                    </td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.formatted_date}}</td>

                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.city_from_name}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.city_to_name}}</td>

                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.location_from_address}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.location_to_address}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.vehicle_from_id}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.vehicle_to_id}}</td>

                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.user_from_courier}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ eachSRF.user_to_courier}}</td>
                </tr>
            </tbody>
        </table>

    </div>
</template>