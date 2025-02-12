export default {
    getToken: (state) => state.token,
    getUpload: (state) => state.upload,
    getParlour:(state) => state.parlour,  
    getListParlour:(state) =>state.listParlour,
    getUpdatePassword:(state)=> state.updatePassword,
    getServiceCategory:(state)=> state.serviceCategory,
    getServiceSubCategory:(state)=> state.serviceSubCategory,
    getServiceSubsubCategory:(state)=> state.serviceSubsubCategory,
    getService:(state)=> state.listService,
    getEmployee:(state)=>state.listEmployee,
    getAddAppoint:(state)=>state.addAppoint,
    getOfferList:(state)=>state.offerList,
};
