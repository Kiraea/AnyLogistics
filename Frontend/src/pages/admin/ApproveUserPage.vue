<script setup>
    import { useSetValidationUser } from '../../Queries';
    import {useGetUnverifiedUsers} from '../../Queries';
    const {data: unverifiedUsersData, isLoading: unverifiedUsersIsLoading , isError: unverifiedUsersIsError, error: unverifiedUsersError } = useGetUnverifiedUsers();


    const {useSetValidationUserAsync} = useSetValidationUser(); 

    const updateUserValidation = async (userId, validationStatus) => {
        await useSetValidationUserAsync({userId, validationStatus});
    }
</script>

<template>

    <div class="flex flex-col gap-5">
        <div class="font-bold text-4xl">Unverified Users</div> 
        <table class="w-full border-collapse border border-black">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-2   border border-gray-500">Action</th>
                    <th class="p-2  text-center  border border-gray-500">First Name</th>
                    <th class="p-2  text-center border border-gray-500">Last Name</th>
                    <th class="p-2  text-center border border-gray-500">Email</th>
                    <th class="p-2  text-center border border-gray-500">Phone Number</th> <!--Dropdown that lists the items-->
                    <th class="p-2  text-center  border border-gray-500">Company Name</th> <!--Dropdown that lists the items-->
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in unverifiedUsersData" :key="user.id" class=" border-black">

                    <td class="p-2  order border-gray-500 text-center">
                        <button @click="updateUserValidation(user.id, true)" class="rounded-2xl p-2 bg-blue-400  ">Accept</button>
                    </td>
                    <td class="p-2 text-center border border-gray-500">{{ user.first_name}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.last_name}}</td>
                    <td class="p-2  text-center  border border-gray-500">{{ user.email}}</td>
                    <td class="p-2   text-center border border-gray-500">{{ user.phone_number}}</td>
                    <td class="p-2  text-center border border-gray-500">{{ user.company_name}}</td>
                </tr>
            </tbody>
        </table>

    </div>
   

</template>