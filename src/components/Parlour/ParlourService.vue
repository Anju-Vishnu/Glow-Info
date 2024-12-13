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
          <v-btn class="log" @click="navparlourlogin">Parlour Login</v-btn>
        </v-app-bar> 
      
        <v-main>
        <v-card width="750px" class="text-black mx-auto">
          <v-container fluid>
            <v-row dense>
              <v-col cols="12">
                <h1 class="mt-3">Add Services</h1>
                <!-- Form to add new service -->
                <v-form ref="form" @submit.prevent="addService">
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
                    v-model="newService.time"
                    label="Service Time"
                    :rules="[
                      v => !!v || 'Time is required',
                      v => /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(v) || 'Invalid time format. Use hr:min:sec (e.g., 02:30:15)'
                    ]"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="newService.categoryId"
                    :items="categories"
                    label="Category"
                    :rules="[v => !!v || 'Category is required']"
                    required
                  ></v-select>
                  <v-select
                    v-model="newService.subCategoryId"
                    :items="subCategoryOptions"
                    label="Sub Category"
                    :rules="[v => !!v || 'Sub Category is required']"
                    required
                  ></v-select>
                  <v-select
                    v-model="newService.subSubCategoryId"
                    :items="subSubCategoryOptions"
                    label="Subsub Category"
                    :rules="[v => !!v || 'Subsub Category is required']"
                    required
                  ></v-select>
                  <v-file-input
                    label="Add Image"
                    @change="handleServiceImage"
                    accept="image/*"
                    outlined
                  ></v-file-input>

                  <v-btn type="submit" color="primary">Add Service</v-btn>
                </v-form>

                <!-- Display Services -->
                <v-btn @click="toggleItems" color="primary">
                  {{ showItems ? 'Hide Items' : 'Show Items' }}
                </v-btn>

                <v-data-table
                  v-if="showItems && services.items.length"
                  :items="services.items"
                  :headers="tableHeaders"
                  item-value="id"
                  class="mt-4"
                >
                  <template v-slot:top>
                    <h2>Services List</h2>
                  </template>
                  <!-- Custom slot for image column -->
                  <template v-slot:item.img="{ item }">
                    <v-img :src="item.img" max-height="150px" max-width="150px" class="max-auto"></v-img>
                  </template>
                  <!-- Custom Slot for actions -->
                  <template v-slot:item.actions="{item}">
                    <v-btn color="primary" @click="editService(item)">Edit</v-btn>
                    <v-btn color="error" @click="deleteService(item)">Delete</v-btn>
                  </template>
                </v-data-table>
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
      services: { items: [] },
      tableHeaders: [
        { text: 'Service Name', value: 'itemName' },
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Service Time', value: 'time' },
        { text: 'Category', value: 'categoryId' },
        { text: 'Sub Category', value: 'subCategoryId' },
        { text: 'Subsub Category', value: 'subSubCategoryId' },
        { text: 'Image', value: 'img' },
        { text: 'Actions', value:'actions', sortable: false},
      ],
      newService: {
        itemName: '',
        description: '',
        price: '',
        time: '',
        categoryId: null,
        subCategoryId: null,
        subSubCategoryId: null,
      },
      editingServiceIndex: null, // Track editing index
      serviceImage: null,
      imagePreviewUrl: '',
      showItems: false,
      // categories: ['Men', 'Women', 'Kid'],
      // subcategories: {
      //   Men: ['Bridal', 'Hair', 'Makeover', 'Skin', 'Nails'],
      //   Women: ['Facial', 'Massage', 'Makeover', 'Haircut', 'Nails'],
      //   Kid: ['Kids Haircut', 'Kids Facial'],
      // },
      //         subsubcategories: {
      //     Men: {
      //       Bridal: ['Wedding', 'Reception'],
      //       Hair: ['Haircut', 'Styling'],
      //       Makeover: ['Makeover'],
      //       Skin: ['Facial', 'Massage'],
      //       Nails: ['Manicure', 'Pedicure']
      //     },
      //     Women: {
      //       Facial: ['Anti-aging', 'Brightening'],
      //       Massage: ['Full-body', 'Neck & Shoulder'],
      //       Makeover: ['Bridal', 'Party'],
      //       Haircut: ['Short', 'Long'],
      //       Nails: ['Manicure', 'Pedicure']
      //     },
      //     Kid: {
      //       'Kids Haircut': ['Boys', 'Girls'],
      //       'Kids Facial': ['Basic', 'Special']
      //     }
      //},
      };
    },
  //   watch: {
  //   'newService.categoryId'(newVal) {
  //     if (newVal) {
  //       this.updateSubcategories();  // Only call the update if newVal is valid
  //     }
  //   },
  //   'newService.subCategoryId'(newVal) {
  //     if (newVal) {
  //       this.updateSubsubcategories();  // Only call the update if newVal is valid
  //     }
  //   }
  // },
  methods: {
      handleServiceImage(event) {
      // Ensure the event is not null and files are available
      const file = event && event.target && event.target.files ? event.target.files[0] : null;
        
      if (file) {
        // Check if the file is a valid image
        if (file && file.type.startsWith('image/')) {
          // Generate the URL for the file and store it for preview
          this.serviceImage = file;
          this.imagePreviewUrl = URL.createObjectURL(file);
        } else {
          alert('Please select a valid image file.');
        }
      } else {
        console.error('No file selected or invalid event');
      }
    },
    resetForm() {
      this.newService = { itemName: '', description: '', price: '', categoryId: null, subCategoryId: null, subSubCategoryId: null };
      this.$refs.form.reset();
      this.serviceImage = null;
    },
    updateSubcategories() {
      this.subCategoryOptions = this.subcategories[this.newService.categoryId] || [];
      this.newService.subCategoryId = null;
      this.newService.subSubCategoryId = null;
    },
    updateSubsubcategories() {
      this.subSubCategoryOptions = this.subsubcategories[this.newService.categoryId]?.[this.newService.subCategoryId] || [];
    },
    addService() {
      if (this.$refs.form.validate() && this.serviceImage) {
        const newService = { ...this.newService, img: URL.createObjectURL(this.serviceImage) };
        this.services.items.push(newService);
        this.resetForm();
      } else {
        alert('Please fill all fields and select an image.');
      }
    },
    toggleItems() {
      this.showItems = !this.showItems;
    },
    editService(service) {
      // Load the selected service data into the form for editing
      this.newService = { ...service };
      this.showItems = false; // Hide the table to focus on the form
    },
    deleteService(service) {
      // Find the index of the service to be deleted
      const index = this.services.items.indexOf(service);
      if (index !== -1) {
        // Remove the service from the list
        this.services.items.splice(index, 1);
      }
    },
    serviceList(){
      const serviceList = JSON.parse(sessionStorage.getItem("serviceList"));
      return serviceList;
    },
    navparlourlogin() {
      this.$router.push({ name: 'parlourLogin' });
    },
    async serviceAdd() {
      this.loading = true;
            try {
              const payload = {
                itemName: this.newService.itemName,
                description: this.newService.description,
                price: this.newService.price,
                time: this.newService.time,
                categoryId: this.newService.categoryId,
                subCategoryId: this.newService.subCategoryId,
                subSubCategoryId: this.newService.subSubCategoryId,
                image: this.serviceImage // Ensure the image data is included if needed
              };
                // Simulate add service process
              await this.$store.dispatch('parlour/ParlourService', payload);
   
              this.$router.push({name: 'parlourService'});
              this.success = true;
              this.resetForm();

            } catch (error) {
                console.error(error);
                this.error = error.response?.data?.message || 'Add service failed';
            } finally {
                this.loading = false;
            }
        },
        async serviceCategory(){
          try{
            await this.$store.dispatch('parlour/serviceCategory');
          }catch (error) {
            console.error(error);
          } 
        },
        async serviceSubCategory(){
          try{
            await this.$store.dispatch('parlour/serviceSubCategory');
          }catch (error) {
            console.error(error);
          }
        },
        async serviceSubSubCategory(){ // method name
          try{
            await this.$store.dispatch('parlour/serviceSubSubCategory'); //action name
          }catch(error){
            console.error(error);
          }
        },
      },
      mounted(){
        this.serviceCategory();
        this.serviceSubCategory();
        this.serviceSubSubCategory();
      },
      computed:{
        ...mapGetters('parlour', ['getServiceCategory', 'getServiceSubCategory', 'getServiceSubsubCategory']),
        categories(){
          return this.getServiceCategory;
        },
        subCategories(){
          return this.getServiceSubCategory;
        },
        subSubCategories(){
          return this.getServiceSubsubCategory;
        },
      }
  };
</script>

<style scoped>
 .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
  .profile-photo {
    border-radius: 50;
    border: 2px solid white;
  }
  .round-img {
    border-radius: 10px;
  }
  .square-image {
    border-radius: 5px;
  }
  .custom-gradient {
    background: linear-gradient(to right, #004d40, #00695c);
  }
  .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
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
</style>
