<template>
    <v-app>
      <v-main>
        <v-container fluid>
          <v-form @submit.prevent="submit" ref="form" enctype="multipart/form-data">
            <v-row>
              <v-col cols="12">
                <h2 class="text-center">USER REGISTER</h2>
                <p class="text-center">IT'S COMPLETELY FREE</p>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-text-field 
                  class="mb-2"
                  label="Full Name"
                  variant="outlined"
                  v-model="name"
                  placeholder="User Name"
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="phone"
                  label="Mobile Number"
                  variant="outlined"
                  :rules="phoneRules"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Email"
                  placeholder="example@gmail.com"
                  variant="outlined"
                  v-model="email"
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-radio-group v-model="gender" :rules="genderRules" inline>
                  <label class="custom-field mt-1">Gender</label>
                  <v-radio class="custom-field" label="Male" value="Male"></v-radio>
                  <v-radio class="custom-field" label="Female" value="Female"></v-radio>
                </v-radio-group>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Password"
                  variant="outlined"
                  v-model="password"
                  :rules="passwordRules"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show1 ? 'text' : 'password'"
                  counter
                  @click:append-inner="show1 = !show1"
                ></v-text-field>
              </v-col>
  
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Confirm Password"
                  variant="outlined"
                  v-model="cpassword"
                  :rules="confirmPasswordRules"
                  :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show2 ? 'text' : 'password'"
                  counter
                  @click:append-inner="show2 = !show2"
                ></v-text-field>
              </v-col>
  
              <v-col align="right" cols="12" sm="12">
                <v-btn class="btn1" type="submit">Sign Up</v-btn>
              </v-col>
            </v-row>
          </v-form>
  
          <v-dialog v-model="dialogVis" max-width="450px">
            <v-card>
              <v-card-title class="text-center">Registered Successfully</v-card-title>
              <v-card-actions class="justify-center">
                <v-btn color="primary" @click="handleDialogClose" style="width: 150px">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        phone: '',
        email: '',
        gender: '',
        password: '',
        cpassword: '',
        show1: false,
        show2: false,
        dialogVis: false,
  
        nameRules: [
          (v) => !!v || 'Full Name is required',
          (v) => /^[A-Z][a-zA-Z]*$/.test(v.trim()) || 'Name must start with an uppercase letter and contain only alphabets',
        ],
        phoneRules: [
          (v) => !!v || 'Phone number is required', 
          (v) => /^[6-9][0-9]{9}$/.test(v) || 'Phone must be a valid 10-digit number starting with 6-9',
        ],
        emailRules: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        genderRules: [
          (v) => !!v || "Gender is required.",
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 8 || 'Password must be at least 8 characters long',
          (v) => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
          (v) => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
          (v) => /[0-9]/.test(v) || 'Password must contain at least one numeric digit',
          (v) => /[\W_]/.test(v) || 'Password must contain at least one special character',
        ],
        confirmPasswordRules: [
          (v) => !!v || 'Confirm Password is required',
          (v) => v === this.password || 'Passwords do not match',
        ],
      };
    },
    methods: {
      submit() {
        if (this.$refs.form.validate()) {
          this.$router.push({name:'userLog'});
          this.dialogVis = true;
        } else {
          console.log('Form validation failed');
        }
      },
      handleDialogClose() {
        this.dialogVis = false;
        this.resetForm();
      },
      resetForm() {
        this.name = '';
        this.phone = '';
        this.email = '';
        this.gender = '';
        this.licenseNo = '';
        this.password = '';
        this.cpassword = '';
        this.$refs.form.resetValidation();
      },
    },
  };
  </script>
  
  <style scoped>
  .text-center {
    text-align: center;
  }
  .btn1 {
    width: 100%;
    max-width: 300px;
  }
  .v-container {
    max-width: 1000px;
    width: 100%;
  }
  </style>
  