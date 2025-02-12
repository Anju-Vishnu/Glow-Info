import mutations from './mutations';
import getters from './getters';
import actions from './actions';

export default{
    namespaced:true,
    state() {
        // let parlour = [];
        //     try {
            // } catch (error) {
            //     console.error("Error parsing parlour from sessionStorage:", error);
            // }
            return {
                token: sessionStorage.getItem('token') || '',
                upload: [],
                listParlour:[],
                serviceList:[],
                serviceCategory:[],
                serviceSubCategory:[],
                serviceSubsubCategory:[],
                listService:[],
                updatePassword:[],
                listEmployee:[],
                employees:[],
                addAppoint:[],
                offerList:[],
                // parlour:JSON.parse(sessionStorage.getItem('parlour')) || [],
                parlour: JSON.parse(sessionStorage.getItem('parlour')) || [],
            };
        },
    mutations,
    getters,
    actions
}
