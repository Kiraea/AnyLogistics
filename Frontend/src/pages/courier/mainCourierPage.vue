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

    <div class="w-full flex items-start pl-5 ">
        <div class="font-bold max-[767px]:text-sm">
            Your Assigned Shipping Forms Going to logistics center
        </div>
    </div>


    <div v-if="shippingFormDataFrom?.length > 0" class="overflow-x-auto w-full">
  <table class="min-w-full text-sm text-left text-gray-500 max-[767px]:block">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 max-[767px]:hidden">
      <tr>
        <th class="px-6 py-3">Reference Number</th>
        <th class="px-6 py-3">Weight</th>
        <th class="px-6 py-3">Items Carried</th>
        <th class="px-6 py-3">Shipping To</th>
        <th class="px-6 py-3">Shipping From</th>
        <th class="px-6 py-3">Status</th>
      </tr>
    </thead>
    <tbody class="max-[767px]:block">
      <tr 
        v-for="item in shippingFormDataFrom" 
        :key="item.id" 
        class="border-b max-[767px]:block max-[767px]:border-b-0 max-[767px]:mb-4 max-[767px]:border max-[767px]:rounded-lg"
      >
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)] max-[767px]:before:float-left max-[767px]:before:font-semibold max-[767px]:before:text-gray-700 max-[767px]:before:uppercase" data-label="Reference Number: ">
          {{ item.id}}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Weight: ">
          {{ item.weight }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Items Carried: ">
          <select class="max-[767px]:w-full">
            <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
          </select>
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Shipping To: ">
          {{ item.shipping_to }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Shipping From: ">
          {{ item.shipping_from }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Status: ">
          <select 
            v-model="item.status" 
            @change="handleUpdateStatusSF(item.id, $event.target.value)" 
            class="border rounded max-[767px]:w-full"
          >
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
        <div class="font-bold max-[767px]:text-sm">
            Your Assigned Shipping Forms Going to destination of client address
        </div>
    </div>

    <div v-if="shippingFormDataTo?.length > 0" class="overflow-x-auto w-full">
  <table class="min-w-full text-sm text-gray-500 max-[767px]:block">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 max-[767px]:hidden">
      <tr>
        <th class="px-6 py-3">Reference Number</th>
        <th class="px-6 py-3">Weight</th>
        <th class="px-6 py-3">Items Carried</th>
        <th class="px-6 py-3">Shipping To</th>
        <th class="px-6 py-3">Shipping From</th>
        <th class="px-6 py-3">Status</th>
      </tr>
    </thead>
    <tbody class="max-[767px]:block">
      <tr 
        v-for="item in shippingFormDataTo" 
        :key="item.id" 
        class="border-b max-[767px]:block max-[767px]:border-b-0 max-[767px]:mb-4 max-[767px]:border max-[767px]:rounded-lg"
      >
        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)] max-[767px]:before:float-left max-[767px]:before:font-semibold max-[767px]:before:text-gray-700 max-[767px]:before:uppercase" data-label="Reference Number: ">
          {{ item.id}}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)]" data-label="Weight: ">
          {{ item.weight }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)]" data-label="Items Carried: ">
          <select class="max-[767px]:w-full">
            <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
          </select>
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)]" data-label="Shipping To: ">
          {{ item.shipping_to }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)]" data-label="Shipping From: ">
          {{ item.shipping_from }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:before:content-[attr(data-label)]" data-label="Status: ">
          <select 
            v-model="item.status" 
            @change="handleUpdateStatusSF(item.id, $event.target.value)" 
            class="border rounded max-[767px]:w-full"
          >
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
        <div class="font-bold max-[767px]:text-sm">  
            Past Transactions:
        </div> 
    </div>


    <div v-if="shippingFormDataFinished?.length > 0" class="overflow-x-auto w-full">
  <table class="min-w-full text-sm text-left text-gray-500 max-[767px]:block">
    <!-- Hidden headers on mobile -->
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 max-[767px]:hidden">
      <!-- ... existing header content ... -->
    </thead>
    
    <tbody class="max-[767px]:block">
      <tr 
        v-for="item in shippingFormDataFinished" 
        :key="item.id" 
        class="border-b max-[767px]:block max-[767px]:border-b-0 max-[767px]:mb-4 max-[767px]:border max-[767px]:rounded-lg"
      >
        <!-- Add data-label attributes for mobile -->
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)] max-[767px]:before:float-left max-[767px]:before:font-semibold max-[767px]:before:text-gray-700 max-[767px]:before:uppercase" data-label="Reference Number: ">
          {{ item.id}}
        </td>
        
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Weight: ">
          {{ item.weight }}
        </td>

        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Items Carried: ">
          <select class="max-[767px]:w-full ">
            <option v-for="itemValue in item.inventory">{{ itemValue }}</option>
          </select>
        </td>

        <!-- Repeat data-label for other columns -->
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Shipping To: ">
          {{ item.shipping_to }}
        </td>
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Shipping From: ">
          {{ item.shipping_from }}
        </td>
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Status: ">
          {{ item.status }}
        </td>
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Finished Date: ">
          {{ item.formatted_finished_date}}
        </td>
        <td class="px-6 py-4 max-[767px]:block max-[767px]:text-left max-[767px]:before:content-[attr(data-label)]" data-label="Request Created: ">
          {{ item.formatted_date}}
        </td>
      </tr>
    </tbody>
  </table>
</div>
  </div>

</template>