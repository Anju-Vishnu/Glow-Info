<template>
  <v-app class="bgimage">
    <v-app-bar class="custom-gradient">
      <template v-slot:prepend>
        <i class="fas fa-cut"></i>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn class="btn" @click="navparlourlogin" aria-label="Navigate to Parlour Login">Parlour Login</v-btn>
    </v-app-bar>

    <v-main>
      <!-- Container for centering the card -->
      <v-container fluid class="d-flex justify-center align-center" style="min-height: 100vh" width="1300px">
        <v-card class="pa-4">
          <v-form ref="form" enctype="multipart/form-data">
            <v-row>
              <!-- Profile Photo Upload -->
              <v-col cols="12" sm="3">
                <v-file-input
                  ref="profilePhoto"
                  label="Upload Parlour Profile Photo"
                  v-model="parlourProfilePhoto"
                  :rules="parlourPhotoRules"
                  accept="image/*"
                  outlined
                  :key="parlourProfilePhoto?.name || ''"
                  @change="handlePhotoUpload"
                  error-messages="Please upload a valid profile photo"
                />

                <v-card v-if="profilePreviewUrl" class="mt-4">
                  <v-img :src="profilePreviewUrl" height="200px" class="preview-image"></v-img>
                  <v-card-actions>
                    <v-btn @click="clearPhoto" aria-label="Remove Profile Photo">Remove</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- Cover Photo Upload -->
              <v-col cols="12" sm="3">
                <v-file-input
                  ref="coverPhoto"
                  label="Upload Parlour Cover Photo"
                  v-model="parlourCoverPhoto"
                  :rules="parlourCoverRules"
                  accept="image/*"
                  outlined
                  :key="parlourCoverPhoto?.name || ''"
                  @change="handleCoverUpload"
                  error-messages="Please upload a valid cover photo"
                />

                <v-card v-if="coverPreviewUrl" class="mt-4">
                  <v-img :src="coverPreviewUrl" height="200px"></v-img>
                  <v-card-actions>
                    <v-btn @click="clearCover" aria-label="Remove Cover Photo">Remove</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- License Photo Upload -->
              <v-col cols="12" sm="3">
                <v-file-input
                  ref="licensePhoto"
                  label="Upload Parlour License Photo"
                  v-model="parlourLicensePhoto"
                  :rules="parlourLicenseRules"
                  accept="image/*"
                  outlined
                  :key="parlourLicensePhoto?.name || ''"
                  @change="handleLicenseUpload"
                  error-messages="Please upload a valid license photo"
                />

                <v-card v-if="licensePreviewUrl" class="mt-4">
                  <v-img :src="licensePreviewUrl" height="200px"></v-img>
                  <v-card-actions>
                    <v-btn @click="clearLicense" aria-label="Remove License Photo">Remove</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <!-- Location Upload -->
              <ParlourLocation @childValues="handleLocation" />
              <v-col cols="12" sm="3">
                <v-text-field
                  v-model="latitude"
                  label="Lat:"
                  variant="underlined"
                ></v-text-field>
                <v-text-field
                  v-model="longitude"
                  label="Long:"
                  variant="underlined"
                ></v-text-field>
              </v-col>

              <!-- Submit Button -->
              <v-col cols="12">
                <v-btn class="btn" @click="submit" :loading="loading" :disabled="loading" aria-label="Submit Form">
                  Submit
                </v-btn>
              </v-col>
            </v-row>
          </v-form>

          <!-- Success Dialog -->
          <v-dialog v-model="dialogVis" max-width="450px">
            <v-card>
              <v-card-title class="text-center">Registered Successfully</v-card-title>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="handleDialogClose" style="width: 150px" aria-label="Close Success Dialog">
                  Ok
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ParlourLocation from './ParlourLocation.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ParlourLocation,
  },
  computed: {
    ...mapGetters('parlour', ['getUpload']),
    uploadedDetails() {
      return this.getUpload;
    },
  },
  data() {
    return {
      parlourProfilePhoto: null,
      parlourCoverPhoto: null,
      parlourLicensePhoto: null,
      location: '',
      latitude: '',
      longitude: '',
      loading: false,
      profilePreviewUrl: null,
      coverPreviewUrl: null,
      licensePreviewUrl: null,
      dialogVis: false,
      parlourPhotoRules: [(v) => !!v || 'Profile photo is required.'],
      parlourCoverRules: [(v) => !!v || 'Cover photo is required.'],
      parlourLicenseRules: [(v) => !!v || 'License photo is required.'],
      locationRules: [(v) => !!v || 'Location is required.'],
    };
  },
  methods: {
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePreviewUrl = URL.createObjectURL(file);
        this.parlourProfilePhoto = file;
        this.$refs.profilePhoto.resetValidation();
      }
    },
    clearPhoto() {
      this.parlourProfilePhoto = null;
      this.profilePreviewUrl = null;
      this.$refs.profilePhoto.reset();
    },
    handleCoverUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.coverPreviewUrl = URL.createObjectURL(file);
        this.parlourCoverPhoto = file;
        this.$refs.coverPhoto.resetValidation();
      }
    },
    clearCover() {
      this.parlourCoverPhoto = null;
      this.coverPreviewUrl = null;
      this.$refs.coverPhoto.reset();
    },
    handleLicenseUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.licensePreviewUrl = URL.createObjectURL(file);
        this.parlourLicensePhoto = file;
        this.$refs.licensePhoto.resetValidation();
      }
    },
    clearLicense() {
      this.parlourLicensePhoto = null;
      this.licensePreviewUrl = null;
      this.$refs.licensePhoto.reset();
    },

    // Handle the location selection
    handleLocation(coords) {
      this.location = coords.locationName;
      this.latitude = coords.latitude;
      this.longitude = coords.longitude;
    },

    async submit() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;

      try {
        const formData = new FormData();

        // Append fields to FormData
        formData.append('parlourName', this.uploadedDetails.name);
        formData.append('phoneNumber', this.uploadedDetails.phone);
        formData.append('email', this.uploadedDetails.email);
        formData.append('description', this.uploadedDetails.description);
        formData.append('licenseNumber', this.uploadedDetails.licenseNo);
        formData.append('password', this.uploadedDetails.password);
        formData.append('ratings', 0);
        formData.append('location', this.location);
        formData.append('latitude', this.latitude);
        formData.append('longitude', this.longitude);

        // Append image files (if selected)
        if (this.parlourProfilePhoto) {
          formData.append('image', this.parlourProfilePhoto);
        }
        if (this.parlourCoverPhoto) {
          formData.append('coverImage', this.parlourCoverPhoto);
        }
        if (this.parlourLicensePhoto) {
          formData.append('licenseImage', this.parlourLicensePhoto);
        }

        // Make the API request with FormData
        const response = await this.$store.dispatch('parlour/ParlourReg', formData);

        if (response) {
          this.dialogVis = true;
        } else {
          console.error('Submission failed.');
        }
      } catch (error) {
        console.error('Error during submission:', error);
      } finally {
        this.loading = false;
      }
    },

    handleDialogClose() {
      this.reset();
      this.dialogVis = false;
      this.$router.push({ name: 'parlourLogin' }); // Redirect after the dialog is closed
    },

    reset() {
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
      this.clearPhoto();
      this.clearCover();
      this.clearLicense();
      this.location = '';
      this.latitude = '';
      this.longitude = '';
    },

    async convertFileToBinary(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
  },
};
</script>

<style scoped>
.preview-image {
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.btn{
  width: 100%;
  max-width: 150px;
  box-shadow: black 2px;
  background: linear-gradient(to left, #8d259b, #ff00bf);
}
.success-message {
  color: green;
}
.error-message {
  color: red;
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
</style>