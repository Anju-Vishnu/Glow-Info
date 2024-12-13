import axios from "axios";
  
export default {
    // Parlour Login
    async ParlourLogin({ rootGetters, commit }, payload) {
        try {
            const response = await axios.post(`${rootGetters.getBaseUrl}/parlour/ParlourLogin`, payload);

            if (response.status >= 200 && response.status < 300) {
                commit('setToken', response.data.token);
                commit('setParlour', response.data);
                console.log(response.data);
                return true;
            }
        } catch (error) {
            console.error(error);
        }
    },
    // Parlour Registration
    async ParlourReg({ rootGetters }, payload) {
        try {
            const response = await axios.post(`${rootGetters.getBaseUrl}/parlour/ParlourReg`, payload);

            if (response.status >= 200 && response.status < 300) {
                console.log('Registration Successful');
                return response.data;
            }
            }catch (error) {
            console.error(error);
            return error.response;
        }
    },
    //Add Service
    async ServiceAdd({ rootGetters, getters }, payload) {
        try {
            const response = await axios.post(`${rootGetters.getBaseUrl}/Items/AddItems`, payload,
            {
                headers:{
                    Authorization: `Bearer ${getters.getToken}`
                }
            });
    
            if (response.status >= 200 && response.status < 300) {
                return {success:true, message: response.data.message|| 'Service add successfully'};
            } else {
                // Handle non-2xx responses
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return { success:false,message: `Request failed with status code ${response.status}` };
            }
        } catch (error) {
            // Handle network errors or unexpected issues
            console.error(error);
            
            if (error.response) {
                // If there is a response object (e.g., server error)
                return { success: false, message: error.response.data.message || 'An error occurred on the server' };
            } else {
                // If no response object, it could be a network error or timeout
                return { success: false, message: 'Network error or timeout occurred' };
            }
        }
    },
    async serviceCategory({rootGetters,commit}){
     try{
         const response = await axios.get(`${rootGetters.getBaseUrl}/Categories/all`)
         if (response.status >= 200 && response.status < 300) {
         console.log('response',response.data)
         commit('setServiceCategory', response.data);
         }}
         catch(error){
           console.error(error)
         }
     },
    async serviceSubCategory({rootGetters,commit},payload){
     try{
         const response = await axios.get(`${rootGetters.getBaseUrl}/SubCategory/all`, payload)
         if (response.status >= 200 && response.status < 300) {
         console.log('response',response.data)
         commit('setServiceSubCategory', response.data);
         }}
         catch(error){
           console.error(error)
         }
     },
    async serviceSubSubCategory({rootGetters,commit},payload){
        try{
            const response = await axios.get(`${rootGetters.getBaseUrl}/SubSubCategory/all`, payload)
            if (response.status >= 200 && response.status < 300) {
            console.log('response',response.data)
            commit('setServiceSubsubCategory', response.data);
            }}
            catch(error){
              console.error(error)
            }
        },
    //List Service 
    async serviceList({rootGetters},payload){
        try{
            const response = await axios.get(`${rootGetters.getBaseUrl}/Items/AddItems`, payload)
            if (response.status >= 200 && response.status < 300) {
            console.log('response',response.data)
            }}
            catch(error){
              console.error(error)
            }
        }
    };
