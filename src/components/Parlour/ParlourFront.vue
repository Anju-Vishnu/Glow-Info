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
  
      <!-- Main Container -->
        <!--container-->
      <v-main class="bg-image">
        <v-container fluid>
          <v-row justify="left" align="left" style="height: 100vh;">
            <v-col class="text">
              <h1>Welcome to GlowInfo</h1>
              <p>At GlowInfo, we believe that beauty is more than skin deep –</p> 
                <p>it's about feeling confident and radiant from the inside out.</p> 
                <p>Whether you're looking for a relaxing spa treatment,</p> 
                <p>a glamorous makeover, or expert skincare,</p> 
               <p>we are here to provide you with exceptional</p> 
                <p>beauty services tailored to your unique needs.</p>
              <v-btn
                class="mt-5 log-btn"
                @click="goToLogin"
                >
                Log In
              </v-btn>
              <v-btn
                class="mt-5 log-btn"
                @click="goToSignUp"
                >
                Sign Up
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    methods: {
      goToLogin() {
        this.$router.push({ name: 'parlourLogin' }); // Adjust the route name for login page
      },
      goToSignUp() {
        this.$router.push({ name: 'parlourReg' }); // Adjust the route name for sign-up page
      }
    }
  };
  </script>
  
  <style scoped>
  .bg-image {
    background-image: url('@/assets/beauty4.jpg'); /* Use your desired background image */
    background-size: cover;
    background-position: center;
    color: rgb(255, 255, 255);
    outline: salmon;
  }
  .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
  h1 {
    font-family: 'Lucida Sans', sans-serif;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .log-btn {
    width: 100%;
    max-width: 150px;
    box-shadow: black 2px;
    background: linear-gradient(to left, #8d259b, #ff00bf);
  }
  .v-btn {
    font-size: 18px;
  }
  .text{
    color: linear-gradient(135deg, #f575c0, #d8794d);
    font-style: italic;
  }
  .custom-gradient {
    background-image: linear-gradient(135deg, #f575c0, #d8794d);
  }
  </style>
  