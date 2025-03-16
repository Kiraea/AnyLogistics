<script setup>
    import { useSetValidationUser } from '../../Queries';
    import {useGetUnverifiedUsers} from '../../Queries'
    const {data: unverifiedUsersData, isLoading: unverifiedUsersIsLoading , isError: unverifiedUsersIsError, error: unverifiedUsersError } = useGetUnverifiedUsers();


    const {useSetValidationUserAsync} = useSetValidationUser(); 

    const updateUserValidation = async (userId, validationStatus) => {
        await useSetValidationUserAsync({userId, validationStatus});
    }
</script>

<template>

    <div class="min-h-screen">
        <div v-for="user in unverifiedUsersData">
            <span>{{ user.first_name }}</span>
            <button @click="updateUserValidation(user.id, true)">Accept</button>

        </div>
    </div>
</template>