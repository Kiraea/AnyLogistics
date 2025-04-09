<script setup>
    import { useRouter } from "vue-router";
    import { Icon } from '@iconify/vue';
    
    const router = useRouter()

    function switchTo(url){
        router.replace(url)
    }

</script>

<template>
    <body class="bg-white grow min-h-screen flex flex-col gap-5">

<!--Navigation button divs-->
        <div name="subcategories" class="bg-blue-300 w-fit h-fit rounded-br-xl p-2 flex flex-row">

            <div name="button1" class="items-center flex flex-col mx-2" @click="switchTo('/admin/viewAccounts')">
                <button name="c1" class="rounded-full bg-white mx-4 p-4 w-fit">
                    <v-icon name="co-user" scale="2.5" fill="#000000" animation="float" hover/>
                </button>
                <span class="text-center">View Users</span>
            </div>

            <div name="button2" class="items-center flex flex-col mx-2" @click="switchTo('/admin/approveAccounts')">
                <button name="c2" class="rounded-full bg-white mx-4 p-4 w-fit">
                    <v-icon name="fa-user-check" scale="2.5" fill="#000000" animation="float" hover/>
                </button>
                <span class="text-center">Approve Users</span>
            </div>

            <div name="button3" class="items-center flex flex-col mx-2">
                <div name="c3" class="rounded-full bg-white mx-4 p-4 w-fit" @click="switchTo('/admin/companies')">
                    <v-icon name="co-building" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">View Companies</span>
            </div>

            
            <div name="button4" class="items-center flex flex-col mx-2">
                <div name="c4" class="rounded-full bg-white mx-4 p-4 w-fit" @click="switchTo('/admin/vehicles')">
                    <v-icon name="bi-truck" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">View Vehicles</span>
            </div>

            <div name="button5" class="items-center flex flex-col mx-2">
                <div name="c5" class="rounded-full bg-white mx-4 p-4 w-fit" @click="switchTo('/admin/vehicles')">
                    <v-icon name="bi-plus-square" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">Add Vehicle</span>
            </div>

            <div name="button6" class="items-center flex flex-col mx-2">
                <div name="c6" class="rounded-full bg-white mx-4 p-4 w-fit" @click="switchTo('/admin/shippingForms')">
                    <v-icon name="ri-file-list-3-line" scale="2.5" fill="#000000" animation="float" hover />
                </div>
                <span class="text-center">Shipping Forms</span>
            </div>
        </div>
        <router-view/>
    </body>
</template>