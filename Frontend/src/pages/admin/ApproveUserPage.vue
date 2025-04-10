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

    <div class="flex flex-col gap-5 px-4">
        <div class="font-bold text-4xl mt-4">Unverified Users</div> 
        <table class="w-full text-sm text-left rtl:text-right table-auto">
            <thead>
                <tr class="bg-blue-300">
                    <th class="px-6 py-3 border-x border-blue-200">Action</th>
                    <th class="px-6 py-3 border-x border-blue-200">First Name</th>
                    <th class="px-6 py-3 border-x border-blue-200">Last Name</th>
                    <th class="px-6 py-3 border-x border-blue-200">Email</th>
                    <th class="px-6 py-3 border-x border-blue-200">Phone Number</th> <!--Dropdown that lists the items-->
                    <th class="px-6 py-3 border-x border-blue-200">Company Name</th> <!--Dropdown that lists the items-->
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(user, index) in unverifiedUsersData" 
                    :key="user.id" 
                    :class="{
                    'bg-blue-100': index % 2 === 0,
                    'bg-white': index % 2 !== 0,
                    'border-b border-blue-200': index === unverifiedUsersData.length - 1
                }"
                >
                    <td class="px-6 py-3 border-x border-blue-200">
                        <button @click="updateUserValidation(user.id, true)" class="rounded-2xl p-2 bg-blue-400  ">Accept</button>
                    </td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ user.first_name}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ user.last_name}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ user.email}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ user.phone_number}}</td>
                    <td class="px-6 py-3 border-x border-blue-200">{{ user.company_name}}</td>
                </tr>
            </tbody>
        </table>

    </div>
   

</template>