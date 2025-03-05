<template>
    <v-app>
      <!-- App Bar Section -->
      <v-app-bar class="custom-gradient">
        <template v-slot:prepend>
          <i class="fas fa-gift"></i> <!-- Updated icon for Offers -->
        </template>
        <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="gotoHome">
            <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-app-bar>
  
      <v-app class="bgimage">
        <v-row class="fill-height" justify="center">
          <!-- Main Column for the Offer Content -->
          <v-col cols="12" sm="8" md="6" lg="4" class="d-flex align-center">
            <v-sheet class="pa-6" :width="$vuetify.display.smAndDown ? '100%' : '500px'" elevation="2" rounded>
              <h2 class="text-center mb-4">Add New Offer</h2>
              <v-form ref="form" @submit.prevent="submitOffer">
               <v-select
                v-model="newOffer.name"
                :items="offerNames"
                label="Offer Name"
                variant="outlined"
                :rules="[v => !!v || 'Offer name is required']"
                required
                class="mb-4"
               ></v-select>
               <v-select
                  v-model="newOffer.services"
                  :items="serviceOptions"
                  label="Add Services"
                  variant="outlined"
                  multiple
                  chips
                  :rules="[v=> v.length>0 || 'Atleast one service required']"
                  required
                  class="mb-4"  
                ></v-select>
               <!-- <v-text-area
                v-model="newOffer.description"
                label="Offer Description"
                varient="outlined"
                :rules="[v => !!v || 'Offer name is required']"
                required
                class="mb-4"
                row="3"
                ></v-text-area> -->
                <!-- <v-text-field
                v-model="newOffer.price"
                label="Offer Price"
                variant="outlined"
                :rules="[
                  v => !!v, 
                  v => /^\d+(\.\d{1,2})?$/.test(v) || 'Only numbers'
                ]"
                required
                class="mb-4"
                ></v-text-field> -->
                <v-text-field
                v-model="newOffer.startDate"
                label="Start Date"
                variant="outlined"
                type="date"
                :min="minDate"
                required
                class="mb-4"
                ></v-text-field>
                <v-text-field
                v-model="newOffer.endDate"
                label="End Date"
                variant="outlined"
                type="date"
                :min="newOffer.startDate || minDate"
                required
                class="mb-4"
                ></v-text-field>
                
                <!-- New Image Field -->
                <v-file-input
                  v-model="newOffer.image"
                  label="Offer Image"
                  show-size
                  accept="image/*"
                  :rules="[v => !!v || 'Image is required']"
                  required
                  class="mb-4"
                ></v-file-input>
              <v-btn
                color="blue"
                type="submit"
                :disabled="loading"
                :loading="loading"
              >
                Add Offer
              </v-btn>
            </v-form>

            <!-- Display Offers -->
            <template v-slot:top>
              <h2>Offer List</h2>
            </template>
            <!-- Custom Slot for actions -->
            <template v-slot:item.actions>
              <v-btn color="primary" @click="editOffer(item)">Edit</v-btn>
              <v-btn color="error" @click="deleteOffer(item)">Delete</v-btn>
            </template>  
              </v-sheet>
            </v-col>
          </v-row>
        </v-app>
      </v-app>
    </template>

<script>
export default {
  data() {
    return {
      loading: false,
      newOffer: {
        name: "",
        // description: "",
        // price: "",
        startDate: "",
        endDate: "",
        image: null,
        services:[],
      },
      minDate: new Date().toISOString().split("T")[0],
      addedOffer: null,
      showItems: false,
      services: {
        items: [], // Array to store the offer list
      },
      offerNames: ["Discount 10%", "Special Package", "Limited Time Offer"], // Predefined offer names
      serviceOptions: [], 
      tableHeaders: [
        { text: "Name", value: "name" },
        // { text: "Description", value: "description" },
        // { text: "Price", value: "price" },
        { text: "Start Date", value: "startDate" },
        { text: "End Date", value: "endDate" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    gotoHome(){
      this.$router.push({ name: 'parlourHome' });
    },
    async fetchServices(){
      try{
        const response= await this.$store.dispatch("parlour/getServices");
        this.serviceOptions = response.map((service)=>service.name);
      }catch (error){
        console.error("Failed to fetch services:",error);
        this.serviceOptions=[];
      }
    },

    async submitOffer() {
      this.loading = true;
      try {
        // Declare and initialize formData correctly
        const formData = new FormData(); // Ensure this line is at the top where formData is first used
        formData.append("name", this.newOffer.name);
        // formData.append("price", this.newOffer.price);
        formData.append("startDate", this.newOffer.startDate);
        formData.append("endDate", this.newOffer.endDate);
        formData.append("services", JSON.stringify(this.newOffer.services)); 
        if (this.newOffer.image) {
          formData.append("image", this.newOffer.image); // Check if the image field is valid
        }
      
        // Dispatch the action with formData
        await this.$store.dispatch("parlour/addOffer", formData);
        this.resetForm();
        this.fetchOffers();
      } catch (error) {
        console.error("Failed to add offer:", error); // Log any errors
      } finally {
        this.loading = false; // Reset loading state
      }
    },
    async fetchOffers() {
      try {
        const response = await this.$store.dispatch("parlour/offerList");
        this.services.items = response; // Update the items with the fetched data
      } catch (error) {
        console.error("Failed to fetch offers:", error);
        this.services.items = []; 
      }
    },
    resetForm() {
      this.newOffer = {
        name: "",
        // description: "",
        // price: "",
        startDate: "",
        endDate: "",
        services:[],
        image:null,
      };
      this.$refs.form.reset();
    },
    toggleItems() {
      this.showItems = !this.showItems;
      if (this.showItems) {
        this.fetchOffers();
      }
    },
    editOffer(offer) {
      // Implement editing logic
      console.log("Editing offer:", offer);
    },
    deleteOffer(offer) {
      // Implement deletion logic
      console.log("Deleting offer:", offer);
    },
  },
  created() {
    this.fetchServices();
    this.fetchOffers(); // Fetch the offers on component creation
  },
};
</script>

<style scoped>
  .offer-details {
    margin-bottom: 20px;
  }
  
  .discount-price {
    color: #ff00bf;
    font-size: 20px;
    font-weight: bold;
  }
  
  .bgimage {
    background-color: #f5f5f5;
    background-image: url("@/assets/beauty4.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
  }
  
  .custom-gradient {
    background-image: linear-gradient(135deg, #f575c0, #d8794d);
  }
  .app-bar-title {
    margin-left: 2px;
    font-size: 30px;
    font-weight: 800;
    font-family: 'Lucida Sans', sans-serif;
  }
  .table-header {
  display: flex;
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  padding: 12px;
}
.table-cell {
  flex: 1;
  padding: 8px;
  text-align: left;
}
.table-body {
  display: flex;
  flex-direction: column;
}
.table-row:hover {
  background-color: #f5f5f5;
}
</style>
  