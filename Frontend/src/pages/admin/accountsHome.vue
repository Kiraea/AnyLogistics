<script setup>
    import { useSetValidationUser } from '../../Queries';
    import {useGetUnverifiedUsers} from '../../Queries';
    import HeaderX from "../../components/HeaderX.vue";
    
    const {data: unverifiedUsersData, isLoading: unverifiedUsersIsLoading , isError: unverifiedUsersIsError, error: unverifiedUsersError } = useGetUnverifiedUsers();


    const {useSetValidationUserAsync} = useSetValidationUser(); 

    const updateUserValidation = async (userId, validationStatus) => {
        await useSetValidationUserAsync({userId, validationStatus});
    }
</script>

<template>
    <HeaderX/>
    <body class="bg-white grow min-h-screen px-8">
        <div name="subcategories" class="bg-blue-300 w-fit h-fit rounded-b-xl p-2 flex flex-row">
            <div name="button1" class="items-center flex flex-col mx-2">
                <div name="c1" class="rounded-full bg-white mx-4 p-4 w-fit">
                    <v-icon name="co-user" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">View Users</span>
            </div>

            <div name="button2" class="items-center flex flex-col mx-2">
                <div name="c2" class="rounded-full bg-white mx-4 p-4 w-fit">
                    <v-icon name="fa-user-check" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">Approve Users</span>
            </div>

            <div name="button3" class="items-center flex flex-col mx-2">
                <div name="c3" class="rounded-full bg-white mx-4 p-4 w-fit">
                    <v-icon name="co-building" scale="2.5" fill="#000000" animation="float" hover/>
                </div>
                <span class="text-center">View Companies</span>
            </div>
        </div>
    </body>
</template>