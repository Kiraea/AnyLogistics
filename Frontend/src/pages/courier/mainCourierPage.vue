<script setup>
    import { useGetShippingFormVehicleId } from '@/Queries';
    import { useUpdateStatusForm } from '@/Queries';
    import { ref } from 'vue';


    import { useGetShippingForm } from '@/Queries';



    const {useUpdateStatusFormAsync} = useUpdateStatusForm()
    //const {data: shippingFormVehicleData , isLoading: shippingFormVehicleIsLoading , isError: shippingFormVehicleIsError, error: shippingFormVehicleError } = useGetShippingFormVehicleId();
    

    const options = ref(['pending', 'declined', 'ready for pickup', 'in travel', 'waiting', 'cancelled', 'finished']);

    const {data: shippingFormData , isLoading: shippingFormIsLoading , isError: shippingFormIsError, error: shippingFormError } = useGetShippingForm()



    const handleUpdateStatusSF = async (formId, newStatus) => {
        console.log("handle update", newStatus, formId)
        await useUpdateStatusFormAsync({formId, newStatus})
    }



</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-white box-border gap-5">
        <h1 class="font-bold text-2xl">Your Assigned Shipping Forms</h1>
        <div class="grid grid-cols-4">
            <div v-for="item in shippingFormData" class="flex flex-col">
                <span><span>  Weight:</span> {{ item.weight}}  </span>
                <span><span>  Items Carried:</span> {{item.inventory}} </span>
                <span><span>  Shipping To:</span> {{ item.shipping_to}} </span>
                <span><span>  Shipping From:</span> {{ item.shipping_from}} </span>
                <select :value="item.status" @change="handleUpdateStatusSF(item.id, $event.target.value)">
                    <option v-for="option in options" :value="option">{{ option }}</option>
                </select>
            </div>
        </div>

    </div>

</template>