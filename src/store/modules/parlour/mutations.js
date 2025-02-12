export default {
    setToken(state, token) {
        state.token = token;
        sessionStorage.setItem('token', token);  // Optional: Store token in sessionStorage
    },
    setUpload(state, upload) {
        state.upload = upload;
    },
    setParlour(state, payload) {
        state.parlour = payload;
        sessionStorage.setItem('parlour', JSON.stringify(payload));  // Optional: Store token in sessionStorage
    },
    setListParlour(state,payload){
        state.listParlour=payload;
        sessionStorage.setItem('listParlour',payload);
    },
    setServiceList(state, payload) {
        state.serviceList = payload;
        sessionStorage.setItem('serviceList', payload);  // Optional: Store token in sessionStorage
    },
    setServiceCategory(state,payload){
        state.serviceCategory = payload;
        sessionStorage.setItem('serviceCategory',payload);
    },
    setServiceSubCategory(state,payload){
        state.serviceSubCategory = payload;
        sessionStorage.setItem('serviceSubCategory',payload);
    },
    setServiceSubsubCategory(state,payload){
        state.serviceSubsubCategory = payload;
        sessionStorage.setItem('serviceSubsubCategory',payload);
    },
    setListService(state,payload){
        state.listService=payload;
        sessionStorage.setItem('listService',payload);
    },
    setUpdatePassword(state,payload){
        state.updatPassword=payload;
        sessionStorage.setItem('updatePassword',payload);
    },
    setAddEmployee(state,payload){
        state.employees.payload;
        sessionStorage.setItem('addEmployee',payload);
    },
    setListEmployee(state,payload){
         state.employees=payload;
         sessionStorage.setItem('listEmployee',payload);
    },
    setAddAppointment(state,payload){
        state.addAppoint=payload;
        sessionStorage.setItem('addAppoint', payload)
    },
    setOfferList(state,payload){
        state.offerList=payload;
        sessionStorage.setItem('offerList',payload);
    },
};
