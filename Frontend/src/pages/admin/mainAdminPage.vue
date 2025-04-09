<script setup>
   
   // Import components
    import { ref, onMounted, watch } from 'vue';

    import HeaderX from "../../components/HeaderX.vue";
    import AdminNav from '@/components/AdminNav.vue';


</script>

<template>
    <HeaderX/>
    <AdminNav/>

    <!-- <Suspense>
        <template #default>
            <HeaderX/>
            <AdminNav/>
        </template>
        <template #fallback>
            <HeaderX/>
            <AdminNav/>
        </template>
    </Suspense> -->

</template>