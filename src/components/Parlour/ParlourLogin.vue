<template>
  <v-app>
    <!-- App Bar Section -->
    <v-app-bar class="custom-gradient">
      <template v-slot:prepend>
        <i class="fas fa-cut"></i>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-app class="bgimage">
      <v-row class="fill-height">
        <!-- Main Column for the Login Card -->
        <v-col cols="12" sm="8" md="6" lg="4" class="d-flex align-center">
          <v-sheet class="pa-6" :width="$vuetify.display.smAndDown ? '100%' : '500px'" elevation="2" rounded>
            <h2 class="text-center mb-4">Parlour Login</h2>

            <!-- Error and Success Alerts -->
            <v-alert v-if="error" type="error" dense class="mb-4">
              {{ error }}
            </v-alert>
            <v-alert v-if="success" type="success" dense class="mb-4">
              Login successful!
            </v-alert>

            <v-form ref="form" @submit.prevent="submitLogin">
              <!-- User Name -->
              <v-text-field
                class="mb-4"
                label="User Name"
                variant="outlined"
                v-model="email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                class="mb-4"
                variant="outlined"
                v-model="password"
                :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                prepend-inner-icon="mdi-lock"
                :type="show1 ? 'text' : 'password'"
                placeholder="Password"
                @click:append-inner="show1 = !show1"
              ></v-text-field>

              <!-- Login Button -->
              <v-btn
                elevation="6"
                rounded="xl"
                class="mt-4 login-btn"
                block
                type="submit"
                :disabled="loading"
                :loading="loading"
              >
                Login
              </v-btn>
            </v-form>
            <!-- Forgot Password Link -->
             <v-row class="mt-3">
              <v-col class="text-center">
                <v-btn text @click="forgotPassword">
                  Forgot Password?
                </v-btn>
              </v-col>
             </v-row>
          </v-sheet>
        </v-col>
      </v-row>
    </v-app>
    <!-- Forgot Password Dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Reset Password</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="Email"
            variant="underlined"
            v-model="resetEmail"
            prepend-inner-icon="mdi-account"
            :rules="[emailRules]"
            type="email"
            required
          ></v-text-field>
          <v-btn color="primary" @click="sendOTP" :disabled="loading || otpSent">
            Send OTP
          </v-btn>

          <v-alert v-if="otpError" type="error" dense class="mt-3">
            {{ otpError }}
          </v-alert>
          <!-- OTP Field -->
          <v-text-field
            label="Enter OTP"
            v-model="otp"
            type="text"
            prepend-inner-icon="mdi-key"
            placeholder="Enter the OTP"
            maxlength="6"
            required
          ></v-text-field>
          <!-- New Password Field -->
          <v-text-field
            v-if="otpSent"
            label="New Password"
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
          ></v-text-field>
          
          <!-- Error message for password mismatch -->
          <v-alert v-if="passwordMismatch" type="error" dense>
            Passwords do not match.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn text @click="submitNewPassword" :disabled="loading">
            Submit
          </v-btn>
        </v-card-actions>
        <v-dialog v-model="showApprovalDialog" max-width="400">
          <v-card>
            <v-card-title>Approval Pending</v-card-title>
            <v-card-text>Your parlour is awaiting approval. Please check back later.</v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="showApprovalDialog = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    show1: false,
    showPassword: false,
    showConfirmPassword: false,
    dialog: false,
    error: "",
    success: false,
    email: "",
    resetEmail:"",
    password: "",
    newPassword: "",
    otp:'',
    otpSent: false, // Track if OTP has been sent
    otpError: "",   // Track OTP-specific errors
    showApprovalDialog: false,
  }),

  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    // Validation rules for reset email
    emailRules: [
      v => !!v || 'Email is required.',
      v => /.+@.+\..+/.test(v) || 'Please enter a valid email address.'
    ],

    async submitLogin() {
      this.error = ""; // Reset error message
      this.success = false;
      if (!this.validateEmail(this.email)) {
        this.error = "Please enter a valid email address.";
        return;
      }
      
      this.loading = true;
      const payload = {
        email: this.email,
        password: this.password,
      };
      try {
        const response = await this.$store.dispatch('parlour/ParlourLogin', payload);
        if(response){
          this.$router.push({ name: 'parlourHome' });
          this.success = true;
          this.$refs.form.reset();
        }
        else{
          this.error = "Invalid credentials. Please try again.";
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    // Generate OTP and send to user's email
    async sendOTP() {
      this.loading = true;
      this.otpError = ""; // Reset any previous OTP errors

      if (!this.validateEmail(this.resetEmail)) {
        this.otpError = "Please enter a valid email address.";
        this.loading = false;
        return;
      }
      try {
        const response = await this.$store.dispatch('parlour/GenerateOTP', { email: this.resetEmail });
        if(response){
        console.log("forgot password",response);
        alert("OTP sent successfully to your email.");
        console.log("OTP sent response:", response); // Debugging line to log successful response
        this.otpSent = true;
        this.otpError = "";
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        console.log("Error response:", error.response);
        this.otpError = error.response?.data?.message || "Failed to send OTP. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    // Forgot Password Method
    forgotPassword(){
      this.dialog = true;
      this.resetEmail = "";
      this.otp = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.otpSent = false;
      this.otpError = "";
    },
    async submitNewPassword() {
      this.loading = true;
      this.otpError = ""; // Reset any previous errors
  try {
        const response = await this.$store.dispatch('parlour/UpdatePassword', {
          email: this.resetEmail,
          otp: this.otp,
          newPassword: this.newPassword,
        });
      if(response){
        console.log("Password update successfully",response);   
        alert("Your password has been updated successfully.");
        this.dialog=false;
      }
    } catch (error) {
        console.error("Error Updating password",error);
        this.otpError = error.response?.data?.message || "Failed to update password. Please try again.";
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.login {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
  width: 100%;
  border-radius: 7px;
  color: #0f0802;
}
.title {
  font-size: 40px;
  font-weight: 1000;
  margin-bottom: 30px;
}
.login-btn {
  width: 100%;
  max-width: 150px;
  box-shadow: black 2px;
  background: linear-gradient(to left, #8d259b, #ff00bf);
}
.bgimage {
  background-image: url("@/assets/beauty3.jpg");
  background-size: cover; /* Ensures the image covers the entire area */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  height: 100%; /* Ensures it covers the full height of the parent */
  width: 100%; /* Ensures it covers the full width of the parent */
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
</style>
