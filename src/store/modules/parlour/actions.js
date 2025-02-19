import axios from "axios";
  
export default {
    // Parlour Registration
    async ParlourReg({ rootGetters }, payload) {
        try {
            const response = await axios.post(
                `${rootGetters.getBaseUrl}/parlour/ParlourReg`,
                payload
            );

            if (response.status >= 200 && response.status < 300) {
                console.log('Registration Successful');
                return response.data;
            }
            }catch (error) {
            console.error(error);
            return error.response;
        }
    },

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
    //Approve Parlour
    async confirmApprove({rootGetters,getters},payload){
        try {
            const response = await axios.get(
                `${rootGetters.getBaseUrl}/parlour/ParlourStatus?parlourId=${payload}`,
                payload,
                    {
                        headers: {
                            Authorization: `Bearer ${getters.getToken}`
                        }
                    }
                );
                if (response.status >= 200 && response.status < 300) { 
                    return true;
                }
            } catch (error) {
                console.error(error);
                return false;
            } 
        },

    // Forgot Password
    async UpdatePassword({rootGetters},payload){
        try{
            const response = await axios.post(`${rootGetters.getBaseUrl}/parlour/forgot_password`, payload);
            if (response.status >= 200 && response.status < 300) {
                console.log('Password Updation Successful');
                return response.data;
            }else{
                console.warn('Unexpected Response:', response);
                return response.data;
            }
            }catch(error){
                console.error('Error during password update:', error);
                throw error;
            }
    },

    async GenerateOTP({ rootGetters }, payload) {
        // return await axios.post(`${rootGetters.getBaseUrl}/parlour/generate_otp`, payload);
        try{
            const response = await axios.post(`${rootGetters.getBaseUrl}/parlour/generate_otp`, payload);
            if (response.status >= 200 && response.status < 300) {
                console.log('Password Updation Successful');
                return true;
            }else{
                console.warn('Unexpected Response:', response);
                return ;
            }
            }catch(error){
                console.error('Error during password update:', error);
                throw error;
            }
      },
    
      // Update Parlour
    async updateParlour({ rootGetters, getters},formData) {
        try {
            const response = await axios.put(
                `${rootGetters.getBaseUrl}/parlour/update`,
                formData,
                    {
                        headers: {
                            Authorization: `Bearer ${getters.getToken}`
                        }
                    }
                );
                if (response.status >= 200 && response.status < 300) { 
                    return true;
                }
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        // Delete Parlour Request
        async deleteParlour({ rootGetters, getters }, payload) {
            try {
              const response = await axios.post(
                `${rootGetters.getBaseUrl}/parlour/request-deletion?id=${payload}`,
                {
                  headers: {
                    Authorization: `Bearer ${getters.getToken}`,
                  },
                }
              );
          
              if (response.status >= 200 && response.status < 300) {
                
                // Pass the correct ID
                return true;
              }
            return false;
            } catch (error) {
              console.error('Error deleting employee:', error);
              return false;
            }
          },
    //Add Service 
    async serviceList({rootGetters, getters},formData){
        try{
            const response = await axios.post(
                `${rootGetters.getBaseUrl}/Items/AddItems`,
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${getters.getToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }); 
                if (response.status >= 200 && response.status < 300) {
                    console.log('Service Added successfully',response.data)
                    return true;
                }
            }catch(error){
                console.error('Error adding service:', error.message);
                throw error;
            }
        },
    async serviceCategory({rootGetters,getters,commit}){
     try{
         const response = await axios.get(`${rootGetters.getBaseUrl}/Categories/all`,
         {
            headers:{
                Authorization: `Bearer ${getters.getToken}`
            }
        });
         if (response.status >= 200 && response.status < 300) {
         console.log('response',response.data)
         commit('setServiceCategory', response.data);
         }}
         catch(error){
           console.error(error)
         }
     },
    async serviceSubCategory({rootGetters,getters,commit}){
     try{
         const response = await axios.get(`${rootGetters.getBaseUrl}/SubCategory/all`,
            {
                headers:{
                    Authorization: `Bearer ${getters.getToken}`
                }
            });
         if (response.status >= 200 && response.status < 300) {
         console.log('Subcategories Response',response.data)
         commit('setServiceSubCategory', response.data);
         }}
         catch(error){
           console.error(error)
         }
     },
    async serviceSubSubCategory({rootGetters,getters,commit}){
        try{
            const response = await axios.get(`${rootGetters.getBaseUrl}/SubSubCategory/all`,
                {
                    headers:{
                        Authorization: `Bearer ${getters.getToken}`
                    }
                });  
            if (response.status >= 200 && response.status < 300) {
            console.log('response',response.data)
            commit('setServiceSubsubCategory', response.data);
            }}
            catch(error){
              console.error(error)
            }
        },
    // Get Service
    async listService({rootGetters,commit},payload){
        try{
            const response =await axios.get(
                `${rootGetters.getBaseUrl}/Items/itemByParlourId?parlourId=${payload}`
            );
            if(response.status>=200 || response.status<300){
                console.log('List of services',response.data)
                commit('setListService', response.data);
                return response.data;
            }else{
                throw new Error(`Unexpected response status: ${response.status}`); 
            }
        }catch(error){
            console.error("Error fetching services", error.response?.data || error.message);
            throw error;
        }
    },
    // Update Service
    async updateService({ rootGetters, getters }, formData) {
        try {
            const response = await axios.put(
                `${rootGetters.getBaseUrl}/Items/update?itemId=${formData}`, 
                {
                    headers: {
                        Authorization: `Bearer ${getters.getToken}`
                    }
                }
            );
            if (response.status >= 200 && response.status < 300) { 
                return true;
            }
        } catch (error) {
        console.error(error);
            return false;
        }
    },
    // Delete Service
    async deleteService({ rootGetters, getters }, payload) {
        try {
            const response = await axios.delete(
                `${rootGetters.getBaseUrl}/Items/delete?itemId=${payload}`,
                {
                  headers: {
                    Authorization: `Bearer ${getters.getToken}`,
                  },
                }
              );
              if (response.status >= 200 && response.status < 300) {
                // Pass the correct ID
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting employee:', error);
            return false;
        }
    },
    //Add Offer
    async addOffer({rootGetters, getters},payload){
        try{
            const response = await axios.post(
                `${rootGetters.getBaseUrl}/offer-categories/offer`, 
                payload,
            {
                headers:{
                    Authorization: `Bearer ${getters.getToken}`
                }
            }
        ); 
        if (response.status >= 200 && response.status < 300) {
            console.log('offer successfully added',response.data)
            return response.data;
        }else {
            throw new Error(`Unexpected response status: ${response.status}`);
          }
        }catch(error){
            console.error("Error adding offer:", error.response?.data || error.message);
            throw error;
        }
    },
    //List Offers 
    async offerList({rootGetters, getters}){
        try{
            const response = await axios.get(`${rootGetters.getBaseUrl}/offer-categories/all`,
            {
                headers:{
                    Authorization: `Bearer ${getters.getToken}`
                }
            }); 
        if (response.status >= 200 && response.status < 300) {
            console.log('Offers fetched successfully:',response.data)
            return response.data;    
        }else {
            throw new Error(`Unexpected response status: ${response.status}`);
          }
        }catch(error){
            console.error("Error fetching offers:", error.response?.data || error.message);
            throw error;
        }
    },

    async editOffer({rootGetters,getters},payload){
        try {
         const response = await axios.put(
            `${rootGetters.getBaseUrl}/offer-categories/all`, 
            payload,
            {
                headers:{
                 Authorization: `Bearer ${getters.getToken}`
                }
            }
        );
        if (response.status >= 200 && response.status < 300) { 
            return true;
        } return false;
        } catch (error) {
            console.error(error);
        }
    },
    
    async deleteOffer({ rootGetters, getters }, payload) {
        try {
          const response = await axios.post(
            `${rootGetters.getBaseUrl}/offer-categories/all`,payload,
            {
              headers: {
                Authorization: `Bearer ${getters.getToken}`,
              },
            }
          );
      
          if (response.status >= 200 && response.status < 300) {// Pass the correct ID
            return true;
          }
      
          return false;
        } catch (error) {
          console.error('Error deleting offer:', error);
          return false;
        }
      },

    // Employee
    async addEmployee({rootGetters,getters},payload){
        try {
         const response = await axios.post(
            `${rootGetters.getBaseUrl}/employees/addEmployee`, 
            payload,
            {
                headers:{
                 Authorization: `Bearer ${getters.getToken}`
                }
            }
        );

        if (response.status >= 200 && response.status < 300) {
            console.log('successfully:',response)
            return response.data;
        } 
        } catch (error) {
            console.error('Error adding employee:', error);
            throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
        }
    },
    async editEmployee({ rootGetters, getters }, payload) {
        try {
            const response = await axios.put(
                `${rootGetters.getBaseUrl}/employees/updateEmployee?employeeId=${payload.id}`, // Use payload.id
                payload, // Send the payload object
                {
                    headers: {
                        Authorization: `Bearer ${getters.getToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status >= 200 && response.status < 300) {
                return response.data; // Return response data if needed
            }
            return false;
        } catch (error) {
            console.error("Error updating employee:", error);
            return false;
        }
    },    
    async deleteEmployee({ rootGetters, getters }, payload) {
        try {
          const response = await axios.delete(
            `${rootGetters.getBaseUrl}/employees/delete?employeeId=${payload}`,
            {
              headers: {
                Authorization: `Bearer ${getters.getToken}`,
              },
            }
          );
      
          if (response.status >= 200 && response.status < 300) {// Pass the correct ID
            return true;
          }
        return false;
        } catch (error) {
          console.error('Error deleting employee:', error);
          return false;
        }
      },
        //Fetching Employee
      async listEmployee({ rootGetters, getters, commit }, payload) {
        try {
          const response = await axios.get(
            `${rootGetters.getBaseUrl}/employees/by-parlourId?parlourId=${payload}`,
            {
              headers: {
                Authorization: `Bearer ${getters.getToken}`,
              },
            }
          );
      
          if (response.status >= 200 && response.status < 300) {
            commit('setListEmployee', response.data); 
            return true;
          }
        return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
    //   async getEmployeeById({rootGetters,getters,commit},payload){
    //     try{
    //         const response = await axios.get(
    //             `${rootGetters.getBaseUrl}/employees/employeeById?employeeId=${payload}`,
    //             {
    //               headers: {
    //                 Authorization: `Bearer ${getters.getToken}`,
    //               },
    //             }
    //           );
          
    //           if (response.status >= 200 && response.status < 300) {
    //             commit('setListEmployee', response.data); 
    //             return true;
    //           }
    //         return false;
    //     }catch(error){
    //         console.error(error);
    //       return false;
    //     }
    //   },
    //   Appointment
      async addAppoint({rootGetters,getters,commit}) {
        try {
         const response = await axios.post(
            `${rootGetters.getBaseUrl}/booking/addBooking`,
            {
                headers:{
                 Authorization: `Bearer ${getters.getToken}`
                }
            }
        );

        if (response.status >= 200 && response.status < 300) {
            commit('setAddAppointment', response.data); 
            return true;
        } 
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return false;
        }
    }
};
