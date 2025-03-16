import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import MainCourierPage from '@/pages/courier/mainCourierPage.vue'
import MainAdminPage from '@/pages/admin/mainAdminPage.vue'
import MainClientPage from '@/pages/client/mainClientPage.vue'
import { useAuthStore } from '@/stores/auth'
import AccountsHome from '@/pages/admin/accountsHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: Register

    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Login 
    },
    {
      path: '/courier',
      name: 'courier',
      component: MainCourierPage,
      beforeEnter : async (to,from) => {

        const authStore = useAuthStore();
        await authStore.authReady; // basically running the checkSessionToken but made it a promise so i can await so ti waits before running the below code
        if (authStore.isLoggedIn === true && authStore.companyName=== "AnyLogisticsB" && authStore.isLoading === false){
          console.log(authStore.companyName);
          console.log("did go to client")
          return true
        }else{
          console.log("did not go to client")
          return {name: 'login'}
        }
      }

    },
    {
      path: '/admin',
      name: 'admin',
      component: MainAdminPage,
      /*beforeEnter : async (to,from) => {

        const authStore = useAuthStore();
        await authStore.authReady; // basically running the checkSessionToken but made it a promise so i can await so ti waits before running the below code

        if (authStore.isLoggedIn === true && authStore.companyName === "AnyLogisticsA" && authStore.isLoading === false){
          console.log(authStore.companyName);
          console.log("did go to client")
          return true
        }else{
          console.log("did not go to client")
          return {name: 'login'}
        }
      },*/
    },
    {
      path: '/admin/accounts',
      name: 'adminAccounts',
      component: AccountsHome
    },
    {
      path: '/client',
      name: 'client',
      component: MainClientPage,
      beforeEnter : async (to,from) => {

        const authStore = useAuthStore();
        await authStore.authReady; // basically running the checkSessionToken but made it a promise so i can await so ti waits before running the below code


        if (authStore.isLoggedIn === true && authStore.companyName !== "AnyLogisticsA" && authStore.companyName !== "AnyLogisticsB" && authStore.isLoading === false){
          console.log(authStore.companyName);
          console.log("did go to client")
          return true
        }else{
          console.log("did not go to client")
          return {name: 'login'}
        }
      }
    },
  ],
})

export default router
