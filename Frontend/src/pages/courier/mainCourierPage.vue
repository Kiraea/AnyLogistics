<script setup>
    import {useCouriersGetPastTransactions, useGetShippingFormVehicleIdFrom, useGetShippingFormVehicleIdTo } from '@/Queries';
    import { useUpdateStatusForm } from '@/Queries';
    import { ref } from 'vue';
    import HeaderX from '@/components/HeaderX.vue';

    const {useUpdateStatusFormAsync} = useUpdateStatusForm()
    //const {data: shippingFormVehicleData , isLoading: shippingFormVehicleIsLoading , isError: shippingFormVehicleIsError, error: shippingFormVehicleError } = useGetShippingFormVehicleId();
    

    const optionsTo = ref(['waiting', 'traveling to destination', 'finished']);
    const options = ref(['ready for pickup', 'traveling to sortation', 'waiting']);

    const {data: shippingFormDataFrom = [] , isLoading: shippingFormFromIsLoadingTo, isError: shippingFormFromIsError, error: shippingFormFromError } = useGetShippingFormVehicleIdFrom()
    const {data: shippingFormDataTo = [] , isLoading: shippingFormToIsLoading , isError: shippingFormToIsError, error: shippingFormToError } = useGetShippingFormVehicleIdTo()
    const {data: shippingFormDataFinished = [] , isLoading: shippingFormFinishedIsLoading , isError: shippingFormFinishedIsError, error: shippingFormFinishedError } = useCouriersGetPastTransactions()



    const handleUpdateStatusSF = async (formId, newStatus) => {
        console.log("handle update", newStatus, formId)
        await useUpdateStatusFormAsync({formId, newStatus})
    }

    console.log(shippingFormDataFinished)
</script>

<template>
   <div class="min-h-screen flex flex-col text-black bg-white items-center box-border gap-5">
    <HeaderX />

    <div class="w-full flex items-start pl-5">
        <div class="font-bold ">
            Your Assigned Shipping Forms Going to logistics center
        </div>
    </div>


    <div v-if="shippingFormDataFrom?.length > 0" class="overflow-x-auto w-full">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-6 py-3">Reference Number</th>
            <th class="px-6 py-3">Weight</th>
            <th class="px-6 py-3">Items Carried</th>
            <th class="px-6 py-3">Shipping To</th>
            <th class="px-6 py-3">Shipping From</th>
            <th class="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shippingFormDataFrom" :key="item.id" class="border-b">

            <td class="px-6 py-4">{{ item.id}}</td>

            <td class="px-6 py-4">{{ item.weight }}</td>



            <td class="px-6 py-4">
                <select >
                    <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
                </select>
            </td>

            <td class="px-6 py-4">{{ item.shipping_to }}</td>
            <td class="px-6 py-4">{{ item.shipping_from }}</td>
            <td class="px-6 py-4">
              <select v-model="item.status" @change="handleUpdateStatusSF(item.id, $event.target.value)" class="border rounded">
                <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
        N/A
    </div>


    <div class="w-full flex items-start pl-5">
        <div class="font-bold">
            Your Assigned Shipping Forms Going to destination of client address
        </div>
    </div>

    <div v-if="shippingFormDataTo?.length > 0" class="overflow-x-auto w-full">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-6 py-3">Reference Number</th>
            <th class="px-6 py-3">Weight</th>
            <th class="px-6 py-3">Items Carried</th>
            <th class="px-6 py-3">Shipping To</th>
            <th class="px-6 py-3">Shipping From</th>
            <th class="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shippingFormDataTo" :key="item.id" class="border-b">

            <td class="px-6 py-4">{{ item.id}}</td>
            <td class="px-6 py-4">{{ item.weight }}</td>
            <td class="px-6 py-4">
                <select >
                    <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
                </select>
            </td>
            <td class="px-6 py-4">{{ item.shipping_to }}</td>
            <td class="px-6 py-4">{{ item.shipping_from }}</td>
            <td class="px-6 py-4">
              <select v-model="item.status" @change="handleUpdateStatusSF(item.id, $event.target.value)" class="border rounded">
                <option v-for="option in optionsTo" :key="option" :value="option">{{ option }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
        N/A
    </div>


    <div class="w-full flex items-start pl-5">
        <div class="font-bold">  
            Past Transactions:
        </div> 
    </div>


    <div v-if="shippingFormDataFinished?.length > 0" class="overflow-x-auto w-full">
      <table class="min-w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th class="px-6 py-3">Reference Number</th>
            <th class="px-6 py-3">Weight</th>
            <th class="px-6 py-3">Items Carried</th>
            <th class="px-6 py-3">Shipping To</th>
            <th class="px-6 py-3">Shipping From</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Finished Date</th>
            <th class="px-6 py-3">Request Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shippingFormDataFinished" :key="item.id" class="border-b">

            <td class="px-6 py-4">{{ item.id}}</td>
            <td class="px-6 py-4">{{ item.weight }}</td>

            <td class="px-6 py-4">
                <select >
                    <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
                </select>
            </td>

            <td class="px-6 py-4">{{ item.shipping_to }}</td>
            <td class="px-6 py-4">{{ item.shipping_from }}</td>
            <td class="px-6 py-4">{{ item.status }}</td>
            <td class="px-6 py-4">{{ item.formatted_finished_date}}</td>
            <td class="px-6 py-4">{{ item.formatted_date}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>