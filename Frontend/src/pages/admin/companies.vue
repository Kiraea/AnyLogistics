<script setup>
    

    import { useGetCompany } from '@/Queries';

    const {data: companiesData = [], isLoading: companiesIsLoading, isError: companiesIsError, error: companiesError} = useGetCompany()
</script>

<template>

    <div class="flex flex-col gap-5 px-4">
        <div class="font-bold text-4xl mt-4">Companies</div> 
        <table class="w-full text-sm text-left rtl:text-right table-auto">
            <thead>
                <tr class="bg-blue-300">
                    <th class="px-6 py-3 border-x border-blue-200">Company ID</th>
                    <th class="px-6 py-3 border-x border-blue-200">Company Name</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(company, index) in companiesData" 
                    :key="company.id" 
                    :class="{
                    'bg-blue-100': index % 2 === 0,
                    'bg-white': index % 2 !== 0,
                    'border-b border-blue-200': index === companiesData.length - 1
                    }"
                >
                    <th class="px-6 py-3 border-x border-blue-200">{{ company.id }}</th>
                    <th class="px-6 py-3 border-x border-blue-200">{{ company.name }}</th>
                </tr>
            </tbody>
        </table>
    </div>
</template>