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
          </v-sheet>
        </v-col>
      </v-row>
    </v-app>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    show1: false,
    error: "",
    success: false,
    email: "",
    password: "",
  }),

  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    async submitLogin() {
      this.error = ""; // Reset error message
      this.success = false;

      if (!this.email || !this.password) {
        this.error = "Please enter both username and password.";
        return;
      }

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
          this.email = "";
          this.password = "";
          this.$refs.form.reset();
        }
        else{
          alert("utftydrtdrysyt")
        }
      } catch (error) {
        console.error(error);
        this.error = "Login failed";
      } finally {
        this.loading = false;
      }
    },
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
