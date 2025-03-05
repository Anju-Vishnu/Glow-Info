<template>
  <v-app class="bgimage">
    <v-card class="mx-auto">
      <!-- App Bar Section -->
      <v-app-bar class="custom-gradient">
        <template v-slot:prepend>
          <i class="fas fa-cut"></i>
        </template>
        <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <v-card width="1600px" class="text-black mx-auto">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12">
                <h1 class="mt-3">Add Services</h1>
                <!-- Form to add new service -->
                <v-form ref="form" v-model="formValid" @submit.prevent="handleFormSubmit">
                  <v-text-field
                    v-model="newService.itemName"
                    label="Service Name"
                    :rules="[v => !!v || 'Service name is required']"
                    required
                  ></v-text-field>
                  <v-textarea
                    v-model="newService.description"
                    label="Description"
                    :rules="[v => !!v || 'Description is required']"
                    required
                  ></v-textarea>
                  <v-text-field
                    v-model="newService.price"
                    label="Price"
                    :rules="[v => !!v || 'Price is required', v => /^\d+(\.\d{1,2})?$/.test(v) || 'Invalid price format']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newService.serviceTime"
                    label="Service Time"
                    :rules="[v => !!v || 'Time is required', v => /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(v) || 'Invalid time format (hh:mm:ss)']"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="newService.categoryId"
                    :items="categories"
                    item-title="name"
                    item-value="id"
                    label="Category"
                    :rules="[v => !!v || 'Category is required']"
                    required
                  ></v-select>
                  <v-select
                    v-model="newService.subCategoryId"
                    :items="subCategories"
                    item-title="subCategoryName"
                    item-value="id"
                    label="Sub Category"
                    :rules="[v => !!v || 'Sub Category is required']"
                    required
                  ></v-select>
                  <v-select
                    v-model="newService.subSubCategoryId"
                    :items="subSubCategories"
                    item-title="subSubCategoryName"
                    item-value="id"
                    label="Subsub Category"
                    :rules="[v => !!v || 'Subsub Category is required']"
                    required
                  ></v-select>
                  <v-file-input
                    ref="fileInput"
                    label="Add Image"
                    @change="handleServiceImage"
                    accept="image/*"
                    outlined
                  ></v-file-input>
                  <v-checkbox
                    label="Availability"
                    v-model="newService.availability"
                  ></v-checkbox>

                  <v-btn type="submit" color="primary" :loading="loading">Add Service</v-btn>
                </v-form>

                <!-- Service Table -->
                <div class="service-table mt-4">
                  <div class="table-header">
                    <div class="table-cell">Service Name</div>
                    <div class="table-cell">Description</div>
                    <div class="table-cell">Price</div>
                    <div class="table-cell">Service Time</div>
                    <div class="table-cell">Image</div>
                    <div class="table-cell">Actions</div>
                  </div>

                  <div v-if="listService.length === 0" class="empty-state">
                    No services found.
                  </div>

                  <div
                    class="table-row"
                    v-for="(service, index) in listService"
                    :key="index"
                  >
                    <div class="table-cell">{{ service.itemName }}</div>
                    <div class="table-cell">{{ service.description }}</div>
                    <div class="table-cell">{{ service.price }}</div>
                    <div class="table-cell">{{ service.serviceTime }}</div>
                    <div class="table-cell">
                      <v-img :src="service.img" max-height="80px" max-width="80px"></v-img>
                    </div>
                    <div class="table-cell actions">
                      <v-btn color="primary" @click="editService(service)">Edit</v-btn>
                      <v-btn color="error" @click="deleteService(service)">Delete</v-btn>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      services: [],
      tableHeaders: [
        { text: "Parlour ID", value: "parlourId" },
        { text: "Service Name", value: "itemName" },
        { text: "Description", value: "description" },
        { text: "Price", value: "price" },
        { text: "Service Time", value: "serviceTime" },
        { text: "Category", value: "categoryId" },
        { text: "Sub Category", value: "subCategoryId" },
        { text: "Subsub Category", value: "subSubCategoryId" },
        { text: "Image", value: "img" },
        { text: "Availability", value: "availability" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      newService: {
        parlourId: "",
        itemName: "",
        description: "",
        price: "",
        serviceTime: "",
        availability:"false",
        categoryId: null,
        subCategoryId: null,
        subSubCategoryId: null
      },
      serviceImage: null,
      imagePreviewUrl: "",
      showItems: false,
      formValid: false,
      loading: false,
      error: null
    };
  },
  computed: {
    ...mapGetters("parlour", ["getServiceList","getServiceCategory", "getServiceSubCategory", "getServiceSubsubCategory", "getParlour","getService"]),
    categories() {
      return this.getServiceCategory;
    },
    subCategories() {
      return this.getServiceSubCategory;
    },
    subSubCategories() {
      return this.getServiceSubsubCategory;
    },
    parlour() {
      console.log("list",this.parlour);
      return this.getParlour;
      
    },
    listService(){
      console.log("list",this.getService);
      return this.getService;
    },
    serviceList(){
      return this.getServiceList;
    },
  },
  mounted() {
    this.fetchService();
    this.$store.dispatch("parlour/serviceCategory");
    this.$store.dispatch("parlour/serviceSubCategory");
    this.$store.dispatch("parlour/serviceSubSubCategory");
  },
  methods: {
    handleFormSubmit() {
      if (this.formValid) {
        this.serviceAdd();
      } else {
        alert("Form is invalid!");
      }
    },
    handleServiceImage(event) {
      const file = event?.target?.files?.[0];
      if (file && file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024) {
        this.serviceImage = file;
        this.imagePreviewUrl = URL.createObjectURL(file);
      } else {
        alert("Please select a valid image file (max size 2MB).");
        this.serviceImage = null;
        this.imagePreviewUrl = "";
      }
    },
    resetForm() {
      this.newService = {
        parlourId: "",
        itemName: "",
        description: "",
        price: "",
        serviceTime: "",
        availability:"false",
        categoryId: null,
        subCategoryId: null,
        subSubCategoryId: null
      };
      this.$refs.form.reset();
      this.serviceImage = null;
      this.imagePreviewUrl = "";
      if (this.$refs.fileInput) this.$refs.fileInput.reset();
    },
    toggleItems() {
      this.showItems = !this.showItems;
    },
    async serviceAdd() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("parlourId", this.parlour.parlour.id);
        formData.append("itemName", this.newService.itemName);
        formData.append("description", this.newService.description);
        formData.append("price", this.newService.price);
        formData.append("serviceTime", this.newService.serviceTime);
        formData.append("availability",this.newService.availability);
        formData.append("categoryId", this.newService.categoryId);
        formData.append("subCategoryId", this.newService.subCategoryId);
        formData.append("subSubCategoryId", this.newService.subSubCategoryId);
        if (this.serviceImage) formData.append("itemImage", this.serviceImage);

       const response= await this.$store.dispatch("parlour/serviceList", formData);
       if(response.success){
        this.showSuccessSnackbar("Service added successfully!");
        this.resetForm();
       }else{
        // alert(response.message);
       }
      } catch (error) {
        console.error("Service add error:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchService(){
      try{
        const payload=this.parlour.parlour.id;
        console.log("Fetching services for:",payload);
        const success = await this.$store.dispatch("parlour/listService", payload);
        if (!success) throw new Error("Failed to fetch services");
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    },
    async editService(){
      try{
        const payload=this.parlour.parlour.id;
        const success = await this.$store.dispatch("parlour/updateService", payload);
        if (!success) throw new Error("Failed to fetch services");
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    },
    deleteService(service) {
      alert(`Deleting service: ${service.itemName}`);
    },
  },
};
</script>

<style scoped>
 .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
}
  .profile-photo {
    border-radius: 50;
    border: 2px solid white;
  }
  .custom-gradient {
    background: linear-gradient(to right, #004d40, #00695c);
  }
  
.bgimage {
  background-image: url("@/assets/beauty3.jpg");
  background-size: cover;          /* Ensures the image covers the entire area */
  background-position: center;     /* Centers the image */
  background-repeat: no-repeat;    /* Prevents the image from repeating */
  height: 100%;                    /* Ensures it covers the full height of the parent */
  width: 100%;                     /* Ensures it covers the full width of the parent */
}
.custom-gradient {
  background-image: linear-gradient(135deg, #f575c0, #d8794d);
}
.custom-parent-class {
  border: 2px solid red; /* Just an example of adding style to the parent */
}
.v-form {
  margin-bottom: 20px;
}
.v-btn {
  margin-top: 10px;
}
h1 {
  margin-bottom: 20px;
}
h2 {
  margin-top: 20px;
  margin-bottom: 10px;
}
.log{
  width: 100%;
  max-width: 300px;
  box-shadow: black 2px;
  background: linear-gradient(to left, #8d259b, #ff00bf);
}
.elevation-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
.profile-data {
  text-align: left;
  font-size: medium;
}
.service-table {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  background: white;
}
.table-header, .table-row {
    display: flex;
    padding: 10px;
  }
  
  .table-header .table-cell {
    background-color: #080808;
    color: white;
  }
  
  .table-cell {
    flex: 1;
    padding: 10px;
    font-size: 16px; /* Adjusted font size for better readability */
    color: #0f0101;
  }
  
  .table-body {
    display: flex;
    flex-direction: column;
    background-color: #ac7a1e;
  }
  
  .table-row {
    border-top: 1px solid #070707;
    background-color: white;
  }
  
.table-row:hover {
  background-color: #f5f5f5;
}
.actions {
  display: flex;
  gap: 10px;
}
.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 16px;
}
.custom-image {
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  object-fit: cover; /* Ensures the image covers the area without distorting */
  border: 2px solid #ddd; /* Optional border */
}
</style>
