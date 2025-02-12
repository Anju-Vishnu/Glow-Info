<template>
  <v-app>
    <!-- App Bar Section -->
    <v-app-bar color="brown-darken-4" class="custom-gradient">
      <template #prepend>
        <v-icon>fas fa-cut</v-icon>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
    
      <!-- Info Button -->
      <v-btn icon @click="fetchParlourDetails">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    
      <!-- Dropdown Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon aria-label="Menu">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
           <v-list-item @click="logout">
            <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Parlour Info Dialog -->
    <v-dialog v-model="showDialog" persistent max-width="400px" location="end" content-class="custom-dialog">
      <v-card>
        <v-card-title class="headline text-center pa-2">
          Parlour Details
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center" class="mb-2">
              <v-avatar size="100">
                <v-img 
                  :src="parlour.parlour.image ? 'data:image/png;base64,' + parlour.parlour.image : defaultProfileImage" 
                  alt="Profile Photo"
                ></v-img>
              </v-avatar>
            </v-row>
            <v-row justify="center" class="mt-1">
              <v-col class="text-left pa-1">
                <p><strong>Name:</strong> {{ parlour.parlour.parlourName || 'N/A' }}</p> 
                <p><strong>Email:</strong> {{ parlour.parlour.email || 'N/A' }}</p>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="openDialog">View Profile</v-btn>
          <v-btn color="red" @click="deleteParlour">Delete</v-btn>
          <v-btn color="green" @click="toggleDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Main Content -->
    <v-main>
      <v-card color="grey" width="800px" class="text-black mx-auto">
        <v-container fluid>
          <!-- Slideshow and Profile Section -->
          <v-row dense>
            <v-col cols="12">
              <!-- Cover Image -->
              <v-img
                :src="parlour.parlour.coverImage ? 'data:image/png;base64,' + parlour.parlour.coverImage : defaultCoverImage"
                alt="Cover Photo"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="400px"
                cover
                class="editable-image"
                @click="openImageDialog('cover')"
              ></v-img>
              <!-- Profile Section -->
              <div class="profile-container">
                <v-avatar size="100">
                  <v-img 
                    :src="parlour.parlour.image ? 'data:image/png;base64,' + parlour.parlour.image : defaultProfileImage" 
                    alt="Profile Photo"
                  ></v-img>
                  <v-icon class="edit-icon">mdi-camera</v-icon>
                </v-avatar>
                <v-card-title class="profile-title mt-4">{{ parlour.parlour.parlourName }}</v-card-title>
              </div>
            </v-col>
          </v-row>
        
          <v-dialog v-model="imageDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>Update {{ editingImage === 'profile' ? 'Profile' : 'Cover' }} Picture</v-card-title>
              <v-card-text>
                <!-- Image Preview -->
                <v-img :src="previewImage || defaultImage" height="200px" contain></v-img>
              
                <!-- File Input -->
                <v-file-input 
                  label="Choose Image" 
                  accept="image/*" 
                  @change="handleImageChange"
                ></v-file-input>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="saveImage">Save</v-btn>
                <v-btn color="red" @click="imageDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Dynamic Sections -->
          <template v-for="(section, index) in sections" :key="index">
            <v-col cols="12" md="6">
              <v-btn @click="section.action"><i :class="section.icon"></i> {{ section.label }}</v-btn>
              <template v-if="parlour[section.dataKey]">
                <v-row class="book" v-for="item in parlour[section.dataKey]" :key="item.title">
                  <v-col cols="12">
                    <p>{{ item.title || item.name }}</p>
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </template>
        </v-container>
      </v-card>
    </v-main>
    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Edit Parlour Information</v-card-title>
          <v-card-text>
            <v-text-field 
              v-model="editedCard.parlourName" 
              label="Parlour Name" 
              required
            ></v-text-field>
            <v-text-field 
              v-model="editedCard.email" 
              label="Email" 
              required
            ></v-text-field>
            <v-text-field 
              v-model="editedCard.phoneNumber" 
              label="Phone Number" 
              required
            ></v-text-field>
          </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveChanges()">Save</v-btn>
          <v-btn color="red" @click="editDialog = false">Cancel</v-btn>
      </v-card-actions>
        </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("parlour", ["getParlour"]),
    parlour() {
      return this.getParlour || {parlour:{}};
    }
  },
  data() {
    return {
      imageDialog: false,
      editingImage:'',
      selectedImage:null,
      previewImage:null,
      editDialog: false,
      showDialog: false,
      defaultProfileImage: require('@/assets/beauty6.jpg'), 
      defaultCoverImage: require('@/assets/beauty3.jpg'),
      
      editedCard: {
        parlourId: "",
        parlourName: '',
        email: '',
        phoneNumber: '',
      },
      sections: [
        { 
          label: "Appointment Details", 
          action: () => this.$router.push({ name: "parlourAppoint" }), 
          dataKey: "appointments", 
          icon: "fas fa-edit"
        },
        { 
          label: "Employee Details", 
          action: () => this.$router.push({ name: "parlourEmployee" }), 
          dataKey: "employees", 
          icon: "fas fa-edit" 
        },
        {  
          label: "Services", 
          action: () => this.$router.push({ name: "parlourService" }), 
          dataKey: "services", 
          icon: "fas fa-edit" 
        },
        { 
          label: "Offers", 
          action: () => this.$router.push({ name: "parlourOffers" }), 
          dataKey: "offers", 
          icon: "fas fa-edit" 
        },
      ],
    };
  },
  methods: {
  // Open dialog for profile or cover image
  openImageDialog(type) {
    this.editingImage = type;
    this.previewImage = type === 'profile' 
      ? (this.parlour.parlour.image ? 'data:image/png;base64,' + this.parlour.parlour.image : this.defaultProfileImage)
      : (this.parlour.parlour.coverImage ? 'data:image/png;base64,' + this.parlour.parlour.coverImage : this.defaultCoverImage);
    this.imageDialog = true;
  },

  // Handle Image Change
  handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      this.previewImage = URL.createObjectURL(file); // Show preview
    }
  },

  // Save Image to Backend
  async saveImage() {
    try {
      const formData = new FormData();
      formData.append("id", this.parlour.parlour.id);
      formData.append(this.editingImage === 'profile' ? "profileImage" : "coverImage", this.selectedImage);

      console.log("Uploading image:", this.selectedImage.name);
      await this.$store.dispatch('parlour/updateParlour', formData);

      // ✅ Fetch updated data from backend
      await this.$store.dispatch("parlour/parlour", this.parlour.parlour.id);
        // ✅ Update Local State Immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.editingImage === 'profile') {
          this.parlour.parlour.image = e.target.result.split(",")[1]; // Extract base64 part
        } else {
          this.parlour.parlour.coverImage = e.target.result.split(",")[1];
        }
      };
      reader.readAsDataURL(this.selectedImage);

      alert("Image updated successfully.");
      this.imageDialog = false;
      this.$router.push({ name: "parlourHome" });
    } catch (error) {
      console.error("Failed to update image:", error);
      alert("An error occurred while updating the image.");
    }
  },
    async saveChanges() {
      try {
        const formData = new FormData();
        formData.append("id", this.parlour.parlour.id); // Ensure ID is included
        formData.append("parlourName", this.editedCard.parlourName);
        formData.append("email", this.editedCard.email);
        formData.append("phoneNumber", this.editedCard.phoneNumber);

        console.log("Updating parlour with data:", [...formData.entries()]);
        await this.$store.dispatch('parlour/updateParlour', formData);
       
        this.editDialog = false;
        alert('Parlour information updated successfully.');
        this.$nextTick(()=>{
          console.log("Navigating to parlour profile...");
          this.$router.push({ name: "parlourHome" });
        });
      } catch (error) {
        console.error('Failed to update parlour:', error);
        alert('An error occurred while updating the parlour.');
      }
    },
    async fetchParlourDetails() {
      try {
        const payload = this.parlour?.parlour?.id;
        if (!payload) {
          console.warn("No parlour ID found.");
          return;
        }
        console.log("Fetching parlour details for:", payload);
        await this.$store.dispatch("parlour/parlour", payload);
        this.showDialog = true;
      } catch (error) {
        console.error("Failed to fetch parlour details:", error);
      }
    },
    async deleteParlour(){
      const payload = this.parlour?.parlour?.id;
      const confirmed = ("Are you want to delete this item?");
      if(!confirmed) return;
      const success = await this.$store.dispatch('parlour/deleteParlour',payload);
      if(success){
        alert("PArlour Deleted successfully");
      }else{
        alert("Failed to delete parlour. Please try again");
      }
    },
    mounted() {
      this.$store.dispatch("parlour/listParlour").catch(error => {
        console.error("Failed to load parlour data:", error);
      });
      console.log("Initial parlour data:", this.parlour);
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    openDialog() {
      this.editedCard = { ...this.parlour.parlour };
      this.showDialog = false;
      this.editDialog = true;
    },
    logout() {
      this.$router.push({ name: "parlourLogin" });
    }
  }
};
</script>

<style scoped>
.custom-gradient {
  background-image: linear-gradient(135deg, #f575c0, #d8794d);
}
.app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
.profile-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.profile-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
  margin-top: -50px;
}
.custom-dialog{
  position: fixed !important;
  top: 10px;
  right: 10px; 
  z-index: 9999 !important;
  max-width: 400px;
  }

</style>