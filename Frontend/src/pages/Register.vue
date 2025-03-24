<script setup>
    import {ref} from "vue";
    import {useRouter} from 'vue-router'
    import axios from "axios";
    import HeaderX from '../components/HeaderX.vue'
    import { RouterLink } from 'vue-router';
    import { onMounted } from "vue";


    // to remove all cache queries when visiting login /register
    import { useQueryClient } from "@tanstack/vue-query";
    const queryClient = useQueryClient()




    const router = useRouter();
    // Variables for User table
    const username = ref("");
    const password = ref("");
    const companyId = ref(null);
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const phoneNumber = ref("");
    const locations = ref([{name: "", address:"", cityId:-1}]);
    const cityId = ref(-1);


    const cities = ref([]);


    onMounted(()=> {
        queryClient.clear();

        const getCities = async () => {
            try{
                let result = await axios.get(`${import.meta.env.VITE_BASE_URL_LINK}/city`)
                if (result.status === 200){
                    console.log(result);
                    console.log(result.data.message , "message");
                    cities.value = result.data.data
                }
            }catch(e){
                if (e instanceof AxiosError){
                    console.log(e)
                }
            }
        }
        getCities()


    })



    const addLocation = () => {
        locations.value.push({ name: "", address: "", cityId:-1});
    };

    const removeLocation = (index) => {
        locations.value.splice(index, 1);
    };




    //Roles for put in variable muna cause IDK ano pa role variables ng mga to para dynamic this jsut for labels
    // Need pa ng ref variables pero since no requirement yet then nop

    // FOR CLIENTS (//1)
    const companyName = ref("");

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
    if (!companyId.value) {
        console.log("No companyId selected")
        return
    }
    if (!companyName.value){
        console.log("No companyName selected")
    }

    const userDetailsObj = {
        username: username.value,
        password: password.value,
        companyId: companyId.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        companyName: companyName.value,
    };

    console.log(locations.value[0].cityId);
    if (companyId.value > 2) { // clients
        if (!companyName.value || locations.value[0].name === "" || locations.value[0].cityId === -1){
            console.log("No Company Name / Address / locations")
            return
        }
        userDetailsObj["locationsObj"] = locations.value
    }

    console.log(userDetailsObj);    
    try {
        const result = await axios.post('http://localhost:3000/api/users/register', userDetailsObj)
        if (result.status === 200) {
            console.log("Registration successful", result.data)
            router.push('/login');

        }
    } catch (error) {
        if (axios.isAxiosError(error)) {  // ✅ Check if error is from Axios
            console.log("Error response data:", error.response?.data.message);
        }
    }
}

</script>

<template>
    <div class="min-h-screen flex flex-col text-black bg-cyan-100 box-border">
        <HeaderX/>
        <div v-if="cities.length !== 0" class="flex-grow flex flex-row justify-center items-center gap-5">
            <form @submit.prevent="handleRegisterSubmit" class="flex flex-col p-5 gap-3 bg-blue-200 rounded-2xl">
                <label>Username</label>
                <input type="text" class="bg-white" name="username" v-model="username" > 
                <label>Password</label>
                <input type="password" class="bg-white" name="password" v-model="password"> 


                <label>Firstname</label>
                <input type="text" class="bg-white"  name="firstName" v-model="firstName" > 
                <label>Lastname</label>
                <input type="text"  class="bg-white" name="lastName" v-model="lastName"> 

                <label>email</label>
                <input type="text" class="bg-white" name="email" v-model="email" > 
                <label>phoneNumber</label>
                <input type="text"  class="bg-white" name="phoneNumber" v-model="phoneNumber"> 


                <select v-model="companyId" class="bg-purple-100">
                    <option  :value=1>Admin</option>
                    <option  :value=2>Courier</option>
                    <option  :value=3>Client</option>
                </select>

                <button type="submit" class="bg-white">Submit</button>

                <div>Already have an account? <RouterLink to="/login" class="font-bold">Click Here!</RouterLink></div>
            </form>
            <div class="flex flex-col p-3 gap-3 bg-blue-200 rounded-2xl" v-if="companyId === 3">
                <div class="flex flex-col"> <!-- 1 means client-->
                    <label>Company Name</label>
                    <input type="text" class="bg-white" name='companyName' v-model="companyName">  <!-- Need V-model -->
                </div>

                <div v-for="(location,index) in locations" :key="index" class="flex flex-col">
                    <label>Location Name:</label>
                    <input v-model="location.name" type="text" class="bg-white" placeholder="Enter location name" />

                    <label>Address:</label>
                    <input v-model="location.address" type="text"  class="bg-white" placeholder="Enter address" />

                    <label>City:</label>
                    <select v-model="location.cityId">
                        <option v-for="(city,index) in cities" :value="city.id" :key="index">{{ city.name }}</option>
                    </select> 




                </div>
                    <button @click="removeLocation(index)" v-if="locations.length > 1">Remove</button>
                    <button @click="addLocation">Add Location</button>
            </div>

        </div>
    </div>
</template>