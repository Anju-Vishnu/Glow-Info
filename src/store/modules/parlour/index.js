import mutations from './mutations';
import getters from './getters';
import actions from './actions';

export default{
    namespaced:true,
    state() {
        return {
            token: '',
            upload: [],
            serviceList:[],
            serviceCategory:[],
            serviceSubCategory:[],
            serviceSubsubCategory:[]
            //parlour:JSON.parse(sessionStorage.getItem('parlour')) || [],
        };
    },
    mutations,
    getters,
    actions
}
