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
        sessionStorage.setItem('parlour', payload);  // Optional: Store token in sessionStorage
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
};
