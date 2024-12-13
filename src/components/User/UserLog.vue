<template>
    <v-card class="mx-auto" color="grey-lighten-3" max-width="1028">
      <v-layout>
        <v-main class="bgimage">
          <v-row class="content">
            <h1 class="overlay-title">
              <i class="fas fa-cut" style="font-size:25px;"></i> glowinfo
            </h1>
            <v-row class="content-inner">
              <v-col align="center" style="width: 350px">
              </v-col>
              <v-form  ref="form" @submit.prevent="submitLogin">
                <v-col style="width: 350px">
                  <v-sheet class="mx-auto login" width="300">
                    <h2 class="title text-center">User Login</h2>
                    <v-text-field
                      class="mb-2"
                      label="User name"
                      variant="outlined"
                      v-model="phone"
                      :rules="phoneRules"
                    ></v-text-field>
  
                    <v-text-field
                      class="mb-3"
                      variant="outlined"
                      v-model="password"
                      :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[rules.required]"
                      :type="show1 ? 'text' : 'password'"
                      placeholder="Password"
                      name="input-10-1"
                      counter
                      @click:append-inner="show1 = !show1"
                    ></v-text-field>
  
                    <v-alert v-if="success" type="success" transition="scale-transition" dismissible>
                      {{ successMessage }}
                    </v-alert>
                    <v-alert v-if="error" type="error" transition="scale-transition" dismissible>
                      {{ error }}
                    </v-alert>
  
                    <v-btn
                      elevation="6"
                      rounded="xl"
                      class="mt-0 login-btn"
                      block
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                    >
                      Login
                    </v-btn>
                  </v-sheet>
                </v-col>
              </v-form>
            </v-row>
          </v-row>
        </v-main>
      </v-layout>
    </v-card>
  </template>
  
  <script>
  export default {
    data: () => ({
      loading: false,
      show1: false,
      error: "",
      success: false,
      successMessage: "",
      phone: "",
      phoneRules: [
        (v) => !!v || 'Phone number is required',
        (v) => /^[6-9][0-9]{9}$/.test(v) || 'Phone must be a valid 10-digit number starting with 6-9'
      ],
      password: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters"
      }
    }),

    methods: {
        async submitLogin() {
            this.error = ''; // Reset error message
            this.success = false;
            // Check if the form is valid
    if (!this.phone || !this.password) {
      this.error = "Please enter both username and password."; // Show error if fields are empty
      return;
    }

    this.loading = true; // Start loading

            // Trigger form validation
            const isValid = this.$refs.form.validate(); // Validate the form

            if (!isValid) {
                this.loading = false; // Stop loading if form is invalid
                return; // Don't proceed if the form is invalid
            }

            const payload = {
                phone: this.phone,
                password: this.password
            };

            // Simulate async login process
            try {
                await this.$store.dispatch('user/userLog', payload);
                this.successMessage = "Login successful";
                this.success = true;
                this.phone = ''; // Reset form after success
                this.password = ''; // Reset form after success
            } catch (error) {
                console.error(error);
                this.error = 'Login failed. Please check your credentials or try again.';
            } finally {
                this.loading = false;
            }
        }   
    }   
}

  </script>
  
  <style scoped>
  .login {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 20px;
    width: 100%;
    max-width: 350px;
    border-radius: 7px;
    background-color: #f8f3f300;
    color: #0f0802;
  }
  .title {
    font-size: 40px;
    font-weight: 1000;
    margin-bottom: 30px;
  }
  .content {
    backdrop-filter: blur(3px);
    background-color: rgba(0, 0, 0, 0.496);
    padding: 220px;
    padding-top: 180px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.561);
    border-radius: 10px;
  }
  .content-inner {
    background-image: url("@/assets/beauty2.webp");
    border-radius: 10px;
    padding: 20px;
    width: 800px;
  }
  .login-btn {
    box-shadow: black 2px;
    background-color: #969391;
    color: #dbdbdb;
  }
  .overlay-title {
    padding-bottom: 10px;
    font-size: 40px;
    font-weight: 800;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    color: white;
    border-radius: 10px;
  }
  .bgimage {
    position: relative;
    width: 100%;
    height: 100vh;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../../assets/beauty1.jpg');
  }
  .bgimage::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(0px);
    z-index: 0;
  }
  </style>
  