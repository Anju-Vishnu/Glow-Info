import { createStore } from 'vuex';
import rootGetters from './getters.js';
import rootMutations from './mutations.js';
import rootActions from './actions.js';
import adminModule from './modules/admin/index.js';
import parlourModule from'./modules/parlour/index.js';
import userModule from './modules/user/index.js';


const store=createStore({
    modules:{
        admin: adminModule,
        parlour: parlourModule,
        user: userModule,
    },
    state(){
        return{
                //  baseUrl:'http://192.168.1.14:8080/api',
               // baseUrl:'http://localhost:8086/api',
                 baseUrl:'http://192.168.1.29:8086/api',

        }
    },
    mutations: rootMutations,
    actions: rootActions,
    getters:rootGetters,
});
export default store;