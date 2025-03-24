<script setup>
    import { useGetClientShippingForm } from '@/Queries';

    
    const {data: shippingFormData, isLoading:shippingFormIsLoading, error:shippingFormError, isError:shippingFormIsError} = useGetClientShippingForm();
    if(!shippingFormIsLoading){
        console.log(shippingFormData[0].created_at);
    }
</script>

<template>

    <div class="grid grid-cols-4 gap-4">
        <div v-for="shippingForm in shippingFormData" class="shadow-gray shadow-xl border-2 border-black flex flex-col">
            <div> <span class="font-bold">Weight:</span> {{ shippingForm.weight }}</div>
           
 
            
            <div><span class="font-bold">Created At:</span> {{ shippingForm.formatteddate}}</div>
            <div> <span class="font-bold">Status:</span> {{ shippingForm.status}}</div>

            <div>
           <div class="font-bold">Inventory:</div>
                <ul class="">
                    <li  v-for="(item, index) in shippingForm.inventory" :key="index">
                        •{{ item }}
                    </li>
                </ul>
            </div>
        </div>
    </div>

    
</template>