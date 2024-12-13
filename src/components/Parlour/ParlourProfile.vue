<template>
  <v-app class="bgimage">
    <!-- App Bar Section -->
    <v-app-bar class="custom-gradient">
      <template v-slot:prepend>
        <i class="fas fa-cut"></i>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn style="background-color: blue" @click="navparlourlogin">Parlour Login</v-btn>
    </v-app-bar>

    <!-- Profile Section -->
    <div class="profile-container">
      <v-card class="parlour-profile">
        <v-card-title class="mt-5 ms-4">Parlour Information</v-card-title>
        <v-card-text class="py-0">
          <div class="profile-data ms-4">
            <table>
              <tr>
                <td style="padding-right: 10px;"><strong>Parlour Name</strong></td>
                <td style="padding-right: 10px;">:</td>
                <td>{{ parlourProfile.name }}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>:</td>
                <td>{{ parlourProfile.email }}</td>
              </tr>
              <tr>
                <td><strong>Mobile Number</strong></td>
                <td>:</td>
                <td>{{ parlourProfile.phone }}</td>
              </tr>
            </table>
          </div>

          <!-- Edit Dialog -->
          <v-dialog v-model="editDialog" max-width="600px">
            <v-card>
              <v-card-title>Edit Parlour Information</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="editedCard.parlourName"
                  label="Parlour Name"
                  required
                  :rules="[v => !!v || 'Name is required']"
                ></v-text-field>
                <v-text-field
                  v-model="editedCard.email"
                  label="Email"
                  required
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
                ></v-text-field>
                <v-text-field
                  v-model="editedCard.phone"
                  label="Phone Number"
                  required
                  :rules="[v => !!v || 'Phone number is required']"
                ></v-text-field>
                <v-text-field
                  v-model="editedCard.currentPassword"
                  label="Current Password"
                  required
                  :rules="[v => !!v || 'Current Password is required']"
                ></v-text-field>
                <v-text-field
                  v-model="editedCard.newPassword"
                  label="New Password"
                  required
                  :rules="[v => !!v || 'New Password is required']"
                ></v-text-field>
                <v-text-field
                  v-model="editedCard.confirmPassword"
                  label="Confirm Password"
                  required
                  :rules="[v => !!v || 'Confirm Password is required']"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="green" @click="saveChanges">Save</v-btn>
                <v-btn color="red" @click="cancelChanges">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-text>

        <v-card-actions>
          <v-btn class="btn1" @click="toggleEditDialog">Edit Profile</v-btn>
          <v-btn class="btn1" @click="gotoParlourHome">Home</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      editDialog: false,
      editedCard: {
        parlourName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      parlourProfile: {
        name: '',
        email: '',
        phone: ''
      }
    };
  },
  computed: {
    ...mapGetters('parlour', ['getParlour']),
    parlour() {
      return this.getParlour;
    }
  },
  mounted() {
    const profile = this.parlour;
    if (profile) {
      this.parlourProfile = {
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      };
    }
  },
  methods: {
    navparlourlogin() {
      this.$router.push({ name: 'ParlourLogin' });
    },
    gotoParlourHome() {
      this.$router.push({ name: 'parlourHome' });
    },
    toggleEditDialog() {
      this.editedCard.parlourName = this.parlourProfile.name;
      this.editedCard.email = this.parlourProfile.email;
      this.editedCard.phone = this.parlourProfile.phone;
      this.editedCard.currentPassword = '';
      this.editedCard.newPassword = '';
      this.editedCard.confirmPassword = '';

      this.editDialog = !this.editDialog;
    },
    async saveChanges() {
      try {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.editedCard.email)) {
          alert('Please enter a valid email address.');
          return;
        }

        if (this.editedCard.newPassword !== this.editedCard.confirmPassword) {
          alert('New Password and Confirm Password must match.');
          return;
        }

        await this.$store.dispatch('parlour/updateParlour', {
          name: this.editedCard.parlourName,
          email: this.editedCard.email,
          phone: this.editedCard.phone
        });

        // Update local profile
        this.parlourProfile.name = this.editedCard.parlourName;
        this.parlourProfile.email = this.editedCard.email;
        this.parlourProfile.phone = this.editedCard.phone;

        // Reset form
        this.editedCard = {
          parlourName: '',
          email: '',
          phone: '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        this.editDialog = false;
      } catch (error) {
        console.error('Error saving parlour data:', error);
        alert('Failed to save the changes');
      }
    },
    cancelChanges() {
      this.editedCard = {
        parlourName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.editDialog = false;
    }
  }
};
</script>

<style scoped>
.custom-gradient {
  background-image: linear-gradient(135deg, #f575c0, #d8794d);
}
.bgimage {
  background-image: url("@/assets/beauty3.jpg");
  background-size: cover;          /* Ensures the image covers the entire area */
  background-position: center;     /* Centers the image */
  background-repeat: no-repeat;    /* Prevents the image from repeating */
  height: 100%;                    /* Ensures it covers the full height of the parent */
  width: 100%;                     /* Ensures it covers the full width of the parent */
}
.btn1 {
  width: 100%;
  max-width: 250px;
  box-shadow: black 2px;
  background: linear-gradient(to left, #8d259b, #ff00bf);
}
.v-btn {
  margin-top: 20px;
}
.profile-container {
  margin-top: 50px;
  max-width: 600px;
  margin-left: 0;
  padding-left: 20px;
}
.parlour-profile {
  margin-top: 50px;
  width: 100%;
  max-width: 850px;;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  }
.parlour-profile-edit {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.profile-data {
  text-align: left;
  font-size: medium;
}
.v-card-actions {
  display: flex;
  justify-content: left;
  padding-left: 10px;
  margin-top: 10px;
}
.v-card-text {
  font-size: 1rem;
  line-height: 1.25rem;
}

</style>
