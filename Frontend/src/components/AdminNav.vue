<script setup>
    import { useRouter } from "vue-router";
    import { Icon } from '@iconify/vue';
    
    const router = useRouter()

    function switchTo(url){
        router.replace(url)
    }

</script>

<template>
    <body class="bg-white grow min-h-screen flex flex-row gap-5 items-left">

        <div name="subcategories" class="bg-[#081A51] w-fit min-h-screen rounded-br-xl flex flex-col text-white">

            <div name="button1" class="items-center flex flex-row px-2 py-2 hover:bg-blue-300" @click="switchTo('/admin/viewAccounts')">
                <v-icon name="co-user" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center pr-4">View Users</span>
            </div>

            <div name="button2" class="items-center flex flex-row px-2 py-2 hover:bg-blue-300" @click="switchTo('/admin/approveAccounts')">
                <v-icon name="fa-user-check" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center">Approve Users</span>
            </div>

            <div name="button3" class="items-center flex flex-row pl-2 py-2 pr-4 hover:bg-blue-300" @click="switchTo('/admin/companies')">
                <v-icon name="co-building" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center">View Companies</span>
            </div>

            
            <div name="button4" class="items-center flex flex-row px-2 py-2 hover:bg-blue-300" @click="switchTo('/admin/vehicles')">
                <v-icon name="bi-truck" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center">View Vehicles</span>
            </div>

            <div name="button5" class="items-center flex flex-row px-2 py-2 hover:bg-blue-300" @click="switchTo('/admin/addVehicles/')">
                <v-icon name="bi-plus-square" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center">Add Vehicle</span>
            </div>

            <div name="button6" class="items-center flex flex-row px-2 py-2 hover:bg-blue-300" @click="switchTo('/admin/shippingForms')">
                <v-icon name="ri-file-list-3-line" scale="1.8" fill="#ffffff" class="ml-2 mr-4"/>
                <span class="text-center">Shipping Forms</span>
            </div>
        </div>

        <router-view/>
    </body>
</template>