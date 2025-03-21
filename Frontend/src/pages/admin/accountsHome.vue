<script setup>
   
   // Import components

    import HeaderX from "../../components/HeaderX.vue";
    import AdminNav from '@/components/AdminNav.vue';
   
   
    // Import db query functions
//    import {useGetUnverifiedUsers} from '../../Queries';
    
    
//     // Retrieve all users from pool
//    let unverifiedUsers = useGetUnverifiedUsers();

//    console.log("hi")
//    console.log(unverifiedUsers)

// Ideal for an actual hosted db instance
    async function getUsers() {
        const url = `${import.meta.env.VITE_BASE_URL_LINK}/users/unverifiedUsers`;
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Response status: ${response.data}`)
            }

            const json = await response.json()
           
            //console.log(json)
            return json.data
            
        } catch (error) {
            console.error(error.message)
        }
    }

    // let users = await getUsers()
    // getUsers().then(result=> {
    //     console.log(result)

    //     users = result
    // })
    
    // console.log(users)
    
    // fetch(`${import.meta.env.VITE_BASE_URL_LINK}/users/unverifiedUsers`).then(response=> {
    //     if (!response.ok) {
    //         throw new Error("could not fetch")
    //     }
    //     return response.json()
    // })
    // .then(data => console.log(data.data))
    // .catch(error => console.error(error))

    // function fetchUsers() {
    //     let res = fetch(`${import.meta.env.VITE_BASE_URL_LINK}/users/unverifiedUsers`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error ("could not fetch")
    //             }
    //             //console.log(response.json())
                
    //             return response.json()
    //         })
    //         return res;
    // }

    
</script>

<template>
    

    <Suspense>
        <template #default>
            <HeaderX/>
            <AdminNav/>
        </template>
        <template #fallback>
            <HeaderX/>
            <AdminNav/>
        </template>
    </Suspense>

</template>