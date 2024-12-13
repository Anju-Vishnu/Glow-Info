<template>
  <v-app class="bgimage">
    <v-card class="mx-auto">
      <!-- App Bar Section -->
      <v-app-bar class="custom-gradient">
        <template v-slot:prepend>
          <i class="fas fa-cut"></i>
        </template>
        <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-btn style="background-color: blue" @click="navparlourlogin">Parlour Login</v-btn>
        </v-app-bar> 

        <v-main>
          <v-container fluid>
            <v-form @submit.prevent="next" ref="form" enctype="multipart/form-data">
              <v-row>
                <v-col cols="12">
                  <h2 class="text-center text-yellow-italic">REGISTRATION FORM</h2>
                  <p class="text-center text-yellow-italic">IT'S COMPLETELY FREE</p>
                </v-col>        
                <v-col cols="12" sm="6">
                    <v-text-field 
                      class="mb-2"
                      label="Name"
                      variant="outlined"
                      v-model="name"
                      placeholder="Parlour Name"
                      :rules="parlourNameRules"
                    ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="phone"
                    label="Mobile Number"
                    variant="outlined"
                    :rules= "phoneRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Email"
                    placeholder="example@gmail.com"
                    variant="outlined"
                    v-model="email"
                    :rules=" emailRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-radio-group v-model="category" :rules="categoryRules" outline class="d-flex align-center">
                    <label class="custom-field mt-1">Category</label>
                    <v-radio class="custom-field mr-4" label="Male" value="Men"></v-radio>
                    <v-radio class="custom-field mr-4" label="Female" value="Women"></v-radio>
                    <v-radio class="custom-field" label="Unisex" value="Unisex"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    label="Description"
                    variant="outlined"
                    v-model="description"
                    :rules="descriptionRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="License Number"
                    variant="outlined"
                    v-model="licenseNo"
                    :rules="licenseRules"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Password"
                    variant="outlined"
                    v-model="password"
                    :rules="passwordRules"
                    :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    counter
                    @click:append-inner="show1 = !show1"
                  ></v-text-field>
                </v-col>
            
                <v-col cols="12" sm="6">
                    <v-text-field
                      label="Confirm Password"
                      variant="outlined"
                      v-model="cpassword"
                      :rules=" confirmPasswordRules"
                      :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show2 ? 'text' : 'password'"
                      name="input-10-1"
                      counter
                      @click:append-inner="show2 = !show2"
                    ></v-text-field>
                </v-col>
                <v-col align="right" cols="12" sm="12">
                    <v-btn class="btn1" type="next">NEXT</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
         </v-main>
        </v-card>
      </v-app>
</template>

<script>

export default {

  data() {
    return {
      name: '',
      phone: '',
      email: '',
      category:'',
      description: '',
      licenseNo: '',
      password: '',
      cpassword: '',
      show1: false,
      show2: false,
      parlourNameRules: [(v) => !!v || 'Parlour Name is required',
                        (v) => /^[A-Z][a-zA-Z]*$/.test(v.trim()) || 'Name must start with an uppercase letter and contain only alphabets'],
      
      phoneRules: [(v) => !!v || 'Phone number is required', 
                   (v) => /^[6-9][0-9]{9}$/.test(v) || 'Phone must be a valid 10-digit number starting with 6-9'],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      categoryRules: [
          (v) => !!v || "Category is required.",
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
        (v) => v === this.password ||'Passwords do not match',
      ],
      licenseRules: [(v) => !!v || 'License Number is required',
                     (v) => !/^\s/.test(v) || "License Number should not start with a blank space.",
      ],
      licenseFileRules: [(v) => !!v || 'License File is required'],
      descriptionRules: [
        (v) => !!v || "Description is required.",
        (v) => !/^\s/.test(v) || "Description should not start with a blank space.",
      ],
    };
  },
  methods: {
     async next() {
       // Validate the form
       this.$refs.form.validate().then((validationSuccess) => {
        if (validationSuccess.valid) {
          this.$emit('registrationSuccess', {
            name: this.name,
            phone: this.phone,
            email: this.email,
            category:this.category,
            description: this.description,
            licenseNo: this.licenseNo,
            password: this.password,
            cpassword: this.cpassword
          });
          const payload=
          {
            name: this.name,
            phone: this.phone,
            email: this.email,
            category:this.category,
            description: this.description,
            licenseNo: this.licenseNo,
            password: this.password,
          }
          this.$store.commit('parlour/setUpload',payload);
          this.$router.push({ name: 'parlourUpload' });
       } else {
           // Log the validation errors to the console
           console.log('Form validation failed');
           // Optionally hide the dialog or show some feedback if needed
         }
       });
     },
     
     resetForm() {
        // Reset all the form fields
        this.name = '';
        this.phone = '';
        this.email = '';
        this.category='';
        this.description = '';
        this.licenseNo = '';
        this.password = '';
        this.cpassword = '';
        this.$refs.form.resetValidation();
        this.$refs.form.reset();
      },     
    },
  }

  </script>

<style scoped>
 .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 40px;
  width: 40px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 50%;
  color: #fffcfc;
  font-size: 20px;
  cursor: pointer;
}
 
.v-text-field input {
  color: white;
}
.v-text-field .v-label{
  color: white;
}
.v-text-field .v-input__placeholder {
  color: rgba(255, 255, 255, 0.6); /* Placeholder color */
}
.btn1 {
  width: 100%;
  max-width: 300px;
  box-shadow: black 2px;
  background: linear-gradient(to left, #8d259b, #ff00bf);
}
.v-container {
  max-width: 1000px; /* Maximum width */
  width: 100%;
}
.dia {
  border-radius: 5px;
  background-color: rgb(134, 114, 245);
  padding-top: 15px;
}
.v-img {
    width: 100%;
    height: auto;
  }
  .bgimage {
  background-image: url("@/assets/beauty3.jpg");
  background-size: cover;          /* Ensures the image covers the entire area */
  background-position: center;     /* Centers the image */
  background-repeat: no-repeat;    /* Prevents the image from repeating */
  height: 100%;                    /* Ensures it covers the full height of the parent */
  width: 100%;                     /* Ensures it covers the full width of the parent */
}
.text-yellow-italic {
  color: #df18c5;
  font-style:italic;
}
.custom-gradient {
  background-image: linear-gradient(135deg, #f575c0, #d8794d);
}
</style>
