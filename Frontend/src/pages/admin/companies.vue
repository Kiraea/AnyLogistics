<script setup>
    

    import { useGetCompany } from '@/Queries';

    const {data: companiesData = [], isLoading: companiesIsLoading, isError: companiesIsError, error: companiesError} = useGetCompany()
</script>

<template>

    <div>
        <table>
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-2 text-center border border-gray-500">Company ID</th>
                    <th class="p-2 text-center border border-gray-500">Company Name</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="company in companiesData" class="bg-gray-100">
                    <th class="p-2 text-center border ">{{ company.id }}</th>
                    <th class="p-2 text-center border">{{ company.name }}</th>
                </tr>
            </tbody>
        </table>
    </div>
</template>