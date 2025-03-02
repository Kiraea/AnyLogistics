<script setup>
    import {ref} from "vue";

    const data = {name: "james", status: true}


    const newName = ref("");
    const newStatus = ref(false);

    const listData = ref([
        {
            name: "james", 
            status: true,
        },
        {
            name: "war", 
            status: false,
        },
        {
            name: "yomi", 
            status: false,
        },
    ]);
    const handleClick = (data) => {
        const index = listData.value.findIndex((i) => i.name === data.name);
        listData.value[index].status = !listData.value[index].status
    }
    const addData = () => {
        if (newName.value === ""){
            return
        }
        let obj = {name: newName.value, status: newStatus.value}
        listData.value.push(obj)

    }


</script>

<template>
    <h1>{{ data.name }}</h1>
    <ul>
        <li v-for='data in listData' :key="data.name">
            <span>
                {{ data.name }}
                {{ data.status}}
            </span>
            <button @click="handleClick(data)">ABC</button>
        </li>
    </ul>

    <form @submit.prevent="addData">
        <label>Name</label>
        <input type="text" id="dataName" v-model="newName">
        <label>Status</label>
        <select v-model="newStatus">
            <option :value="true">true</option>
            <option :value="false">false</option>
        </select>
        <button type="submit">Submit</button>
    </form>
</template>