
import { createApp } from 'vue'
import { createPinia } from 'pinia'

//VueIcons
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { CoUser, FaUserCheck, CoBuilding } from "oh-vue-icons/icons";
addIcons(CoUser, FaUserCheck, CoBuilding);

import App from './App.vue'
import router from './router'

import { VueQueryPlugin } from '@tanstack/vue-query'
const app = createApp(App)

app.component("v-icon", OhVueIcon);

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
