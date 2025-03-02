<script setup>
    import {ref} from "vue";


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

    const courierLabelA = "Vehicle Type"
    const courierLabelB = "Model"
    const courierLabelC = "License Number"



    const clientLabelA = "Company Name"
    const clientLabelB = "Company Address"
    const clientLabelC = "Phone Number"


    const adminLabelA = "Admin A"
    const adminLabelB = "Admin B"
    const adminLabelC = "Admin C"




    const handleRegisterSubmit = () => {
        if (username === ""){
            console.log("no username")
            return
        }
        if (password === ""){
            consle.log("no password")
        }
    }

</script>

<template>
    <form @submit.prevent="handleRegisterSubmit">
        <label>Username</label>
        <input type="text" value="username" v-model="username" > 
        <label>Password</label>
        <input type="password" value="username" v-model="password"> 


        <label>Firstname</label>
        <input type="text" name="firstName" v-model="firstname" > 
        <label>Lastname</label>
        <input type="text" name="lastName" v-model="lastname"> 

        <label>email</label>
        <input type="text" name="email" v-model="email" > 
        <label>phoneNumber</label>
        <input type="text" name="phoneNumber" v-model="phoneNumber"> 


        <select v-model="role">
            <option value="courier">Courier</option>
            <option value="admin">Admin</option>
            <option  value="client">Client</option>
        </select>


        <div v-if="role === 'courier'" >
            <label> {{ courierLabelA }}</label>
            <input type="text" :name='courierLabelA'>  <!-- Need V-model -->

            <label>{{ courierLabelB }} </label>
            <input type="text" :name='courierLabelB'>  <!-- Need V-model -->

            <label>{{ courierLabelB }} </label>
            <input type="text" :name='courierLabelB'>  <!-- Need V-model -->
        </div>



        <div v-else-if="role === 'client'" >
            <label> {{ clientLabelA }}</label>
            <input type="text" :name='clientLabelA'>  <!-- Need V-model -->

            <label>{{ clientLabelB}} </label>
            <input type="text" :name='clientLabelB'>  <!-- Need V-model -->

            <label>{{ clientLabelC}} </label>
            <input type="text" :name='clientLabelC'>  <!-- Need V-model -->
        </div>



        <div v-else-if="role === 'admin'" >
            <label> {{ adminLabelA}}</label>
            <input type="text" :name='adminLabelA'>  <!-- Need V-model -->

            <label>{{ adminLabelB}} </label>
            <input type="text" :name='adminLabelB'>  <!-- Need V-model -->

            <label>{{ adminLabelC}} </label>
            <input type="text" :name='adminLabelC'>  <!-- Need V-model -->
        </div>




        <button type="submit"></button>
    </form>
</template>