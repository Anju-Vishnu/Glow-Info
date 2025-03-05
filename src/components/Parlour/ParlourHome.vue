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
                <p><strong>Name:</strong> {{ parlourName }}</p>
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

    <v-dialog v-model="editDialog" persistent max-width="400px" content-class="custom-dialog">
      <v-card>
        <v-card-title class="headline text-center">Edit Profile</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateParlour">
              <v-text-field label="Parlour Name" v-model="parlourName" required></v-text-field>
              <v-text-field label="Phone Number" v-model="phoneNumber" required></v-text-field>
              <v-text-field label="Email" v-model="email" required></v-text-field>
              <v-text-field label="Password" v-model="password" type="password" required></v-text-field>
              <v-file-input label="Profile Image" accept="image/*" @change="handleImageUpload"></v-file-input>
              <v-file-input label="Cover Image" accept="image/*" @change="handleCoverImageUpload"></v-file-input>
              <v-text-field label="License Number" v-model="licenseNumber" required></v-text-field>
              <v-file-input label="License Image" accept="image/*" @change="handleLicenseImageUpload"></v-file-input>
              <v-text-field label="Ratings" v-model="ratings" required></v-text-field>
              <v-text-field label="Location" v-model="location" required></v-text-field>
              <v-textarea label="Description" v-model="description"></v-textarea>
              <v-text-field label="Latitude" v-model="latitude" required></v-text-field>
              <v-text-field label="Longitude" v-model="longitude" required></v-text-field>
              <v-text-field label="Status" v-model="status" required></v-text-field>
             
              <v-btn type="submit" color="primary">Update</v-btn>
            </v-form>
        </v-card-text>
        <v-card-actions class="justify-center">
          <!-- <v-btn color="primary" @click="saveProfile">Save</v-btn> -->
          <v-btn color="red" @click="editDialog = false">Cancel</v-btn>
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
          <!-- Cover Image Upload Dialog -->
          <!-- <v-dialog v-model="coverDialog" persistent max-width="400px">
            <v-card>
              <v-card-title class="headline text-center">Change Cover Photo</v-card-title>
              <v-card-text>
                <v-file-input 
                  label="Upload New Cover Image" 
                  accept="image/*" 
                  @change="handleCoverImageUpload"
                ></v-file-input>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="saveCoverImage">Save</v-btn>
                <v-btn color="red" @click="coverDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
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
    }
  },
  mounted() {
    this.editedName = this.parlourName;
    this.editedEmail = this.parlourEmail;
    this.editedPhone = this.phoneNumber;
    this.editedProfileImage = this.getProfileImage;
  },
  data() {
    return {
      // parlourName: "",
      // phoneNumber: "",
      password: "",
      email: "",
      image: null,
      coverImage: null,
      licenseNumber: "",
      licenseImage: null,
      ratings: "",
      location: "",
      description: "",
      latitude: "",
      longitude: "",
      id: "1",
      status: "0",
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
    handleCoverImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.convertFileToBase64(file).then(base64 => {
          this.coverImage = base64;
        });
      }
    },
    async saveCoverImage() {
      if (!this.selectedCoverFile) {
        alert("Please select an image.");
        return;
      }

      const base64Image = await this.convertFileToBase64(this.selectedCoverFile);

      const payload = {
        id: this.parlour?.parlour?.id,
        coverImage: base64Image
      };

      const success = await this.$store.dispatch("parlour/updateParlour", payload);

      if (success) {
        alert("Cover photo updated successfully!");
        this.coverDialog = false;
      } else {
        alert("Failed to update cover photo.");
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.convertFileToBase64(file).then(base64 => {
          this.image = base64;
          this.editedProfileImage = 'data:image/png;base64,' + base64; // Update preview
        });
      }
    },
    async updateParlour() {
      try {
        const formData = new FormData();
        formData.append("parlourName", this.editedName);
        formData.append("phoneNumber", this.editedPhone);
        formData.append("password", this.password);
        formData.append("email", this.editedEmail);

        if (this.image) formData.append("image", this.image);
        if (this.coverImage) formData.append("coverImage", this.coverImage);
        
        formData.append("licenseNumber", this.licenseNumber);
        if (this.licenseImage) formData.append("licenseImage", this.licenseImage);
        formData.append("ratings", this.ratings);
        formData.append("location", this.location);
        formData.append("description", this.description);
        formData.append("latitude", this.latitude);
        formData.append("longitude", this.longitude);
        formData.append("id", this.parlour.parlour.id);
        formData.append("status", this.status);
      
        const response = await this.$store.dispatch("parlour/updateParlour", formData);
        console.log("Update Response:", response);
        
        if (response.success) {
          this.$toast.success("Profile updated successfully!");
          this.editDialog = false;
          await this.fetchParlourDetails(); // Refresh details after update
        } else {
          this.$toast.error("Failed to update profile.");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        this.$toast.error("An error occurred while updating the profile.");
      }
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

    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    async openDialog() {
      try {
        // Fetch latest parlour details
        await this.$store.dispatch("parlour/parlour", this.parlour.parlour.id);
      
        // Populate the fields with the latest data
        this.editedName = this.parlourName;
        this.editedEmail = this.parlourEmail;
        this.editedPhone = this.phoneNumber;
        this.editedProfileImage = this.getProfileImage;
        this.image = null; // Reset image selection
        this.coverImage = null; // Reset cover image selection
        this.licenseNumber = this.parlour.parlour.licenseNumber || '';
        this.ratings = this.parlour.parlour.ratings || '';
        this.location = this.parlour.parlour.location || '';
        this.description = this.parlour.parlour.description || '';
        this.latitude = this.parlour.parlour.latitude || '';
        this.longitude = this.parlour.parlour.longitude || '';
        this.status = this.parlour.parlour.status || '0';
      
        this.email = this.parlour.parlour.email || '';
        this.password = this.parlour.parlour.password || ''; // Only if password is stored (not recommended for security reasons)

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