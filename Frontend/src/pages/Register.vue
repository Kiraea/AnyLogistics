<script setup>
    import {ref} from "vue";
    import {useRouter} from 'vue-router'
    import axios from "axios";
    const router = useRouter();
    // Variables for User table
    const username = ref("");
    const password = ref("");
    const role = ref(null);
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phoneNumber = ref("");

    //Roles for put in variable muna cause IDK ano pa role variables ng mga to para dynamic this jsut for labels
    // Need pa ng ref variables pero since no requirement yet then nop

    // FOR CLIENTS (//1)
    const companyName = ref("");
    const companyAddress = ref ("");




    const handleRegisterSubmit = async () => {

    if (!username.value) {
        console.log("No username provided")
        return
    }
    if (!password.value) {
        console.log("No password provided")
        return
    }
    if (!firstName.value) {
        console.log("No first name provided")
        return
    }
    if (!lastName.value) {
        console.log("No last name provided")
        return
    }
    if (!email.value) {
        console.log("No email provided")
        return
    }
    if (!phoneNumber.value) {
        console.log("No phone number provided")
        return
    }
    if (!role.value) {
        console.log("No role selected")
        return
    }
    const userDetailsObj = {
        username: username.value,
        password: password.value,
        roleId: role.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: phoneNumber.value
    };


    if (role.value === 1) { // clients
        if (!companyName.value || !companyAddress.value){
            console.log("No Company Name / Address")
            return
        }
        userDetailsObj["companyName"] = companyName.value
        userDetailsObj["companyAddress"] = companyAddress.value
    }
    if (role.value === 2){ // couriers
        
    }
    if (role.value === 3){ // admins

    }

    console.log(userDetailsObj);
    try {
        // ✅ Make API request
        const result = await axios.post('http://localhost:3000/api/users/register', userDetailsObj)
        if (result.status === 200) {
            console.log("Registration successful", result.data)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {  // ✅ Check if error is from Axios
            console.log("Error response data:", error.response?.data.message);
        }
    }
}
</script>

<template>
    <form @submit.prevent="handleRegisterSubmit">
        <label>Username</label>
        <input type="text" name="username" v-model="username" > 
        <label>Password</label>
        <input type="password" name="password" v-model="password"> 


        <label>Firstname</label>
        <input type="text" name="firstName" v-model="firstName" > 
        <label>Lastname</label>
        <input type="text" name="lastName" v-model="lastName"> 

        <label>email</label>
        <input type="text" name="email" v-model="email" > 
        <label>phoneNumber</label>
        <input type="text" name="phoneNumber" v-model="phoneNumber"> 


        <select v-model="role">
            <option  :value=1>Client</option>
            <option  :value=1>Client</option>
        </select>



        <div v-if="role === 1" > <!-- 1 means client-->
            <label>Company Name</label>
            <input type="text" name='companyName' v-model="companyName">  <!-- Need V-model -->
            <label>Address</label>
            <input type="text" name='companyAddress' v-model="companyAddress">  <!-- Need V-model -->
        </div>



        <button type="submit"></button>
    </form>
</template>