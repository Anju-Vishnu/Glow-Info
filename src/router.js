import { createRouter, createWebHistory } from "vue-router";
import ParlourReg from "./components/Parlour/ParlourReg.vue";
import ParlourUpload from "./components/Parlour/ParlourUpload.vue"; 
import ParlourLocation from "./components/Parlour/ParlourLocation.vue";
import ParlourLogin from "./components/Parlour/ParlourLogin.vue";
import AdminReg from "./components/Admin/AdminReg.vue";
import UserReg from "./components/User/UserReg.vue";
import UserLog from "./components/User/UserLog.vue";
import ParlourHome from "./components/Parlour/ParlourHome.vue";
import ParlourProfile from "./components/Parlour/ParlourProfile.vue";
import ParlourAppoint from "./components/Parlour/ParlourAppoint.vue";
import ParlourService from "./components/Parlour/ParlourService.vue";
import ParlourEmployee from "./components/Parlour/ParlourEmployee.vue";
import ParlourFront from "./components/Parlour/ParlourFront.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/parlourFront", name: 'parlourFront', component: ParlourFront},
    { path: "/parlourEmployee", name: 'parlourEmployee', component: ParlourEmployee},
    { path: "/parlourService", name: 'parlourService', component: ParlourService},
    { path: "/parlourAppoint", name:'parlourAppoint', component: ParlourAppoint},
    { path: "/parlourProfile", name: 'parlourProfile', component: ParlourProfile},
    { path: "/parlourHome", name: 'parlourHome', component: ParlourHome},
    { path: "/userLog", name:'userLog', component: UserLog},
    { path: "/userReg", name:'userReg', component: UserReg},
    { path: "/adminReg", name:'adminReg', component: AdminReg},
    { path: "/parlourLogin", name: 'parlourLogin', component: ParlourLogin },
    { path: "/parlourReg", name: 'parlourReg', component: ParlourReg },
    { path: "/parlourUpload", name: 'parlourUpload', component: ParlourUpload},
    { path: "/parlourLocation", name: 'parlourLocation', component: ParlourLocation},
    { path: "/", redirect: "/parlourLogin" },

  ],
});
export default router;

