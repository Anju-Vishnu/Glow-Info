<template>
  <v-app>
  <v-card class="mx-auto" color="grey-lighten-3" max-width="100%">
    <v-layout>
      <v-app-bar color="teal-darken-4"
                 style="background-image: linear-gradient(135deg, transparent 0%, transparent 50%,rgba(159, 159, 159,0.07) 50%, rgba(159, 159, 159,0.07) 77%,transparent 77%, transparent 100%),linear-gradient(90deg, transparent 0%, transparent 91%,rgba(159, 159, 159,0.07) 91%, rgba(159, 159, 159,0.07) 99%,transparent 99%, transparent 100%),linear-gradient(135deg, transparent 0%, transparent 24%,rgba(159, 159, 159,0.07) 24%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(0deg, transparent 0%, transparent 49%,rgba(159, 159, 159,0.07) 49%, rgba(159, 159, 159,0.07) 63%,transparent 63%, transparent 100%),linear-gradient(90deg, rgb(0,0,0),rgb(0,0,0));">
        <template v-slot:prepend>
          <i class="fas fa-cut"></i>
        </template>
        <v-app-bar-title style="margin-left: 2px; font-size: 30px; font-weight: 800; font-family: 'Lucida Sans', Geneva, Verdana, sans-serif;">
          ADMIN LOGIN
        </v-app-bar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
        <v-container fluid>
          <v-card>
            <v-form @submit.prevent="submit" ref="form" enctype="multipart/form-data">
              <v-row>
                <v-col cols="12">
                  <h2 class="text-center">ADMIN LOGIN</h2>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field 
                    label="User Name"
                    variant="outlined"
                    v-model="userName"
                    placeholder="example@gmail.com"
                    :rules="emailRules"
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
                <v-col align="center" cols="12" sm="12">
                  <v-btn class="btn1" type="submit">Submit</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
  </v-app>
</template>

<script>
export default {
  name: "AdminRegister",
  data() {
    return {
      userName: "",
      password: "",
      cpassword: "",
      show1: false,
      show2: false,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 8 || "Password must be at least 8 characters",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirm Password is required",
        (v) => v === this.password || "Passwords must match",
      ],
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log('Successfully Login')
        //this.$router.push({ name: "AdminPage" });
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  box-shadow: none;
  border: 1px solid #ddd;
  padding: 20px;
}
.btn1 {
  background-color: #0c84b7;
  color: white;
}
.text-center {
  text-align: center;
}
</style>
