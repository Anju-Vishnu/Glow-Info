<template>
  <v-app>
  <!-- App Bar Section -->
  <v-app-bar color="brown-darken-4" class="custom-gradient">
    <template v-slot:prepend>
      <i class="fas fa-cut"></i>
    </template>
    <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
    <!-- <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>
    <v-btn icon><v-icon>mdi-heart</v-icon></v-btn> -->
    
    <!-- Dropdown Menu Button -->
    <!-- Dropdown Menu Button with v-model for explicit control -->
    <!-- <v-menu v-model="menuVisible" open-on-click offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="menuVisible=true">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="goToProfile">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
      </v-menu> -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
      </template>
    
      <v-list>
        <!-- Profile Button -->
      <v-list-item @click="goToProfile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <!-- Log Out Button -->
      <v-list-item @click="logout">
        <v-list-item-title>Log Out</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
<!-- Main Content -->
  <v-main>
    <v-card color="grey" width="800px" class="text-black mx-auto" v-for="parlour in parlour" :key="parlour.id">
      <v-container fluid>
        <!-- Slideshow and Profile Section -->
        <v-row dense>
          <v-col cols="12">
            <v-img
              :src="'data:image/png;base64,' + parlour.coverImage"
              alt="Cover Photo"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="400px"
              cover
            ></v-img>
            <!-- Profile Section -->
            <div class="profile-container">
              <v-avatar size="100">
                <v-img :src="'data:image/png;base64,' + parlour.image" alt="Profile Photo"></v-img>
              </v-avatar>
              <v-card-title class="profile-title">{{ parlour.parlourName }}</v-card-title>
            </div>
          </v-col>
        </v-row>

        <!-- Details Sections -->

        <!-- Appointment Section -->
        <v-col cols="12" md="6">
        <v-btn @click="gotoAppointPage"><i class="fas fa-edit"></i>Appointment Details</v-btn>
        <template v-if="card && card.appointments">
        <v-row class="book" v-for="appointment in card.appointments" :key="appointment.title">
          <!-- Display Appointment Details -->
          <v-col cols="12">
            <p>{{ appointment.title }}</p>
            </v-col>
        </v-row>
        </template>
        </v-col>
        <!-- Employee Section -->
        <v-col cols="12" md="6">
        <v-btn @click="gotoEmployeePage"><i class="fas fa-edit"></i>Employee Details</v-btn>
        <template v-if="card && card.employees">
        <v-row class="book" v-for="employee in card.employees" :key="employee.title">
          <!-- Display Employee Details -->
           <v-col cols="12">
            <p>{{ employee.name }}</p>
           </v-col>
        </v-row>
        </template>
        </v-col>

        <!-- Services Section -->
        <v-col cols="12" md="6">
        <v-btn @click="gotoServicePage"><i class="fas fa-edit"></i>Services</v-btn>
        <template v-if="card && card.services">
        <v-row class="book" v-for="service in card.services" :key="service.title">
          <!-- Display Service Details -->
           <v-col cols="12">
            <p>{{ service.title }}</p>
           </v-col>
        </v-row>
        </template>
        </v-col>

        <!-- Offers Section -->
         <v-col cols="12" md="6">
        <v-btn @click="toggleEditDialog"><i class="fas fa-edit"></i>Offers</v-btn>
        <template v-if="card && card.offers">
          <v-row class="book" v-for="offer in card.offers" :key="offer.title">
            <!-- Offer Card Content -->
             <v-col cols="12">
              <p>{{ offer.title }}</p>
             </v-col>
        </v-row>
        </template>
        </v-col>
      </v-container>
    </v-card>
  </v-main>

    <!-- Edit Dialog -->
    <!-- <v-dialog v-model="editDialog" max-width="800px">
      <v-card color="black" class="text-white">
        <v-card-title>Edit Salon Information</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedCard.parlourName" label="Title" required></v-text-field>
          <v-btn color="green" @click="saveChanges">Save</v-btn>
          <v-btn color="red" @click="cancelChanges">Cancel</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog> -->
</v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      menuVisible: false,
      editDialog: false,
      editedCard: { parlourName: '' },
      items: [
        { title: 'Profile' },
        { title: 'Log Out' },
      ],
    };
  },
  computed: {
    ...mapGetters('parlour', ['getParlour']),
    parlour() {
      return this.getParlour;
    }
  },
  methods: {
    goToProfile() {
      this.$router.push({ name: 'parlourProfile' });
      this.menuVisible=false;
    },
    logout() {
      this.$router.push({ name:'parlourLogin'});
      this.menuVisible=false;
    },
    gotoAppointPage(){
      this.$router.push({name:'parlourAppoint'})
    },
    gotoEmployeePage(){
      this.$router.push({name:'parlourEmployee'})
    },
    gotoServicePage(){
      this.$router.push({name: 'parlourService'})
    },
  }
};
</script>

<style scoped>
.custom-gradient {
  background-image: linear-gradient(135deg, #f575c0, #d8794d);
}
.app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
.profile-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.profile-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 16px;
  margin-top: -50px;
}
</style>