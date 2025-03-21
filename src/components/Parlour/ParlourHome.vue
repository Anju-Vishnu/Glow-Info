<template>
  <v-app>
    <!-- App Bar Section -->
    <v-app-bar color="brown-darken-4" class="custom-gradient">
      <template #prepend>
        <v-icon>fas fa-cut</v-icon>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-btn icon @click="fetchParlourDetails">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      
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
    <v-dialog v-model="showDialog" persistent max-width="400px" content-class="custom-dialog">
      <v-card>
        <v-card-title class="headline text-center">Parlour Details</v-card-title>
        <v-card-text>
          <v-container>
            <v-row justify="center">
              <v-avatar size="100">
                <v-img :src="getProfileImage" alt="Profile Photo"></v-img>
              </v-avatar>
            </v-row>
            <v-row justify="center">
              <v-col class="text-left">
                <p><strong>Parlour Name:</strong> {{ parlourName }}</p>
                <p><strong>Email:</strong> {{ parlourEmail }}</p>
                <p><strong>Phone Number:</strong> {{ phoneNumber }}</p>
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

    <v-dialog v-model="editDialog" persistent max-width="550px" content-class="custom-dialog">
      <v-card>
        <v-card-title class="headline text-center">Edit Profile</v-card-title>
        <v-container>
          <v-form @submit.prevent="updateParlour">
      <!-- Profile Image Upload -->
      <v-img v-if="profileImagePreview" :src="profileImagePreview" contain height="100"></v-img>
      <v-file-input label="Profile Image" accept="image/*" outlined dense 
        @change="handleFileUpload($event, 'profile')">
      </v-file-input>

      <!-- Cover Image Upload -->
      <v-img v-if="coverImagePreview" :src="coverImagePreview" contain height="100"></v-img>
      <v-file-input label="Cover Image" accept="image/*" outlined dense 
        @change="handleFileUpload($event, 'cover')">
      </v-file-input>

      <!-- License Image Upload -->
      <v-img v-if="licenseImagePreview" :src="licenseImagePreview" contain height="100"></v-img>
      <v-file-input label="License Image" accept="image/*" outlined dense 
        @change="handleFileUpload($event, 'license')">
      </v-file-input>

      <v-text-field label="Parlour Name" v-model="editedParlourName" required></v-text-field>
      <v-text-field label="Phone Number" v-model="editedPhoneNumber" required></v-text-field>
      <v-text-field label="Email" v-model="email" required></v-text-field>
      <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
      <v-text-field label="License Number" v-model="licenseNumber" required></v-text-field>
      <v-text-field label="Ratings" v-model="ratings" required></v-text-field>
      <v-text-field label="Location" v-model="location" required></v-text-field>
      <v-textarea label="Description" v-model="description"></v-textarea>
      <v-text-field label="Latitude" v-model="latitude" required></v-text-field>
      <v-text-field label="Longitude" v-model="longitude" required></v-text-field>
      <v-text-field label="Parlour Id" v-model="id" required></v-text-field>
      <v-text-field label="Status" v-model="status" required></v-text-field>
      
      <v-btn color="primary" @click="updateParlour">Update</v-btn>
    </v-form>
  </v-container>
        <v-card-actions class="justify-center">
          <!-- <v-btn color="primary" @click="saveProfile">Save</v-btn> -->
          <v-btn type="submit" color="red" @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Main Content -->
    <v-main>
      <v-card color="grey lighten-3" width="800px" class="mx-auto pa-4">
        <v-container>
          <!-- Cover Image -->
          <v-img 
            :src="getCoverImage" 
            class="editable-image" 
            @click="coverDialog = true" 
            height="400px" 
            cover>
          </v-img>
          
          <!-- Profile Section -->
          <div class="profile-container">
            <v-avatar size="100">
              <v-img :src="getProfileImage" alt="Profile Photo"></v-img>
            </v-avatar>
            <v-card-title class="profile-title mt-4">{{ parlourName }}</v-card-title>
          </div>
          
          <!-- Dynamic Sections -->
          <v-row>
            <v-col v-for="section in sections" :key="section.label" cols="12" md="6">
              <v-btn @click="section.action" block>
                <v-icon left>{{ section.icon }}</v-icon> {{ section.label }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-main>
    <!-- Success Snackbar -->
    <v-snackbar v-model="successSnackbar" timeout="3000" color="success" elevation="2" bottom>
      {{ successMessage }}
      <template v-slot:action>
        <v-btn color="white" text @click="redirectToHomePage">OK</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("parlour", ["getParlour"]),
    parlour() {
      return this.getParlour || { parlour: {} };
    },
    parlourName() {
      return this.parlour.parlour.parlourName || 'N/A';
    },
    parlourEmail() {
      return this.parlour.parlour.email || 'N/A';
    },
    phoneNumber() {
      return this.parlour.parlour.phoneNumber || 'N/A';
    },
    getProfileImage() {
      return this.parlour.parlour.image ? 'data:image/png;base64,' + this.parlour.parlour.image : require('@/assets/beauty6.jpg');
    },
    getCoverImage() {
      return this.parlour.parlour.coverImage ? 'data:image/png;base64,' + this.parlour.parlour.coverImage : require('@/assets/beauty3.jpg');
    },


  },
  mounted() {
    this.editedName = this.parlourName;
    this.editedEmail = this.parlourEmail;
    this.editedPhone = this.phoneNumber;
    this.editedProfileImage = this.getProfileImage;
  },
  data() {
    return {
      editedParlourName: "",
      editedPhoneNumber: "",
      successSnackbar: false,
      successMessage: "",
      password: "",
      email: "",
      licenseNumber: "",
      ratings: "",
      location: "",
      description: "",
      latitude: "",
      longitude: "",
      id: "1",
      status: "",
      profileImage: null,
      profileImagePreview: null,
      coverImage: null,
      coverImagePreview: null,
      licenseImage: null,
      licenseImagePreview: null,
      coverDialog: false, 
      selectedCoverFile: null,
      showDialog: false,
      editDialog: false,
      editedName: "",
      editedEmail: "",
      editedPhone: "",
      editedProfileImage: "",
      selectedFile: null,
      sections: [
        { label: "Appointments", action: () => this.$router.push({ name: "parlourAppoint" }), icon: "mdi-calendar" },
        { label: "Employees", action: () => this.$router.push({ name: "parlourEmployee" }), icon: "mdi-account-group" },
        { label: "Services", action: () => this.$router.push({ name: "parlourService" }), icon: "mdi-cut" },
        { label: "Offers", action: () => this.$router.push({ name: "parlourOffers" }), icon: "mdi-tag" }
      ]
    };
  },
  methods: {
    handleEditFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editData.image = file;
        this.editData.imagePreview = URL.createObjectURL(file);
      }
    },
    // Handle image selection and create a preview
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === "profile") {
          this.profileImage = file;
          this.profileImagePreview = e.target.result;
        } else if (type === "cover") {
          this.coverImage = file;
          this.coverImagePreview = e.target.result;
        } else if (type === "license") {
          this.licenseImage = file;
          this.licenseImagePreview = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },    
    async updateParlour() {
      try {
          const formData = new FormData();
          formData.append("parlourName", this.editedParlourName);
          formData.append("phoneNumber", this.editedPhoneNumber);
          formData.append("password", this.password);
          formData.append("email", this.email);
          formData.append("licenseNumber", this.licenseNumber);
          formData.append("ratings", this.ratings);
          formData.append("location", this.location);
          formData.append("description", this.description);
          formData.append("latitude", this.latitude);
          formData.append("longitude", this.longitude);
          formData.append("id", this.id);
          formData.append("status", this.status);

          
          if (this.profileImage instanceof File) {
            formData.append("image", this.profileImage); // Upload new image
          } 

          if (this.coverImage instanceof File) {
            formData.append("coverImage", this.coverImage);
          }

          if (this.licenseImage instanceof File) {
            formData.append("licenseImage", this.licenseImage);
          }

          const response = await this.$store.dispatch("parlour/editParlour", formData);

          if (response) {
            this.successMessage = "Parlour updated successfully!";
            this.successSnackbar = true;

            await this.$store.dispatch("parlour/parlourUpdated", this.id);

            this.resetForm();
            setTimeout(() => {
              this.$router.push({ name: "parlourHome" });
            }, 2000);
          } else {
             this.showSuccessSnackbar(response?.message || "Failed to update parlour.");
          }
        } catch (error) {
          console.error("Error updating profile:", error);
          this.showSuccessSnackbar("Failed to update parlour.");
        }
    },
    showSuccessSnackbar(message) {
      this.successMessage = message;
      this.successSnackbar = true;
    },

    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    async fetchParlourDetails() {
      try {
        await this.$store.dispatch("parlour/parlour", this.parlour.parlour.id);
        this.showDialog = true;
      } catch (error) {
        console.error("Failed to fetch parlour details:", error);
      }
    },
    async deleteParlour() {
      const parlourId = this.parlour?.parlour?.id; // Ensure you have the correct ID

        const isDeleted = await this.$store.dispatch('parlour/deleteParlour', parlourId);

        if (isDeleted) {
            this.$toast.success('Parlour deletion request sent successfully!');
            // Optionally, redirect or update the UI
            this.$router.push('/dashboard'); 
        } else {
            this.$toast.error('Failed to send deletion request. Please try again.');
        }
    },
    resetForm() {
      this.editedParlourName = "";
      this.email = "";
      this.editedPhoneNumber = "";
      this.password = "";
      this.licenseNumber = "";
      this.ratings = "";
      this.location = "";
      this.description = "";
      this.latitude = "";
      this.longitude = "";
      this.id = "";
      this.status = "";

      // Reset file inputs
      this.profileImage = null;
      this.profileImagePreview = null;
      this.coverImage = null;
      this.coverImagePreview = null;
      this.licenseImage = null;
      this.licenseImagePreview = null;

      // Reset file input elements
      if (this.$refs.profileFileInput) this.$refs.profileFileInput.value = "";
      if (this.$refs.coverFileInput) this.$refs.coverFileInput.value = "";
      if (this.$refs.licenseFileInput) this.$refs.licenseFileInput.value = "";

      this.editDialog = false; // Close the edit dialog
    },
    redirectToHomePage() {
      this.successSnackbar = false;
      this.$router.push({name: 'parlourHome'});
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    async openDialog() {
      try {
        // Fetch latest parlour details
        await this.$store.dispatch("parlour/parlour", this.parlour.parlour.id);
      
        // Populate the fields with the latest data
        this.id = this.parlour.parlour.id || '';
        this.editedParlourName = this.parlour.parlour.parlourName || "";
        this.editedPhoneNumber = this.parlour.parlour.phoneNumber || "";
        this.email = this.parlour.parlour.email;
        this.image = null; // Reset image selection
        this.coverImage = null; // Reset cover image selection
        this.licenseImage = null;
        this.licenseNumber = this.parlour.parlour.licenseNumber || '';
        this.ratings = this.parlour.parlour.ratings || '';
        this.location = this.parlour.parlour.location || '';
        this.description = this.parlour.parlour.description || '';
        this.latitude = this.parlour.parlour.latitude || '';
        this.longitude = this.parlour.parlour.longitude || '';
        this.status = this.parlour.parlour.status || '0';
        this.email = this.parlour.parlour.email || '';
        this.password = this.parlour.parlour.password || ''; // Only if password is stored (not recommended for security reasons)

         // Set image previews from existing data
        this.profileImagePreview = this.parlour.parlour.image ? `data:image/png;base64,${this.parlour.parlour.image}` : null;
        this.coverImagePreview = this.parlour.parlour.coverImage ? `data:image/png;base64,${this.parlour.parlour.coverImage}` : null;
        this.licenseImagePreview = this.parlour.parlour.licenseImage ? `data:image/png;base64,${this.parlour.parlour.licenseImage}` : null;

        // Open the edit dialog
        this.editDialog = true;
      } catch (error) {
        console.error("Failed to fetch parlour details:", error);
        this.$toast.error("Failed to fetch profile details. Please try again.");
      }
    },
    logout() {
      this.$router.push({ name: "parlourLogin" });
    }
  }
};
</script>

<style scoped>
.custom-gradient {
  background: linear-gradient(135deg, #f575c0, #d8794d);
}
.app-bar-title {
  font-size: 24px;
  font-weight: bold;
}
.profile-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: -50px;
}
</style>