<template>
  <v-app class="bgimage">
    <!-- App Bar Section -->
    <v-app-bar class="custom-gradient">
      <template v-slot:prepend>
        <i class="fas fa-cut"></i>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn style="background-color: blue" @click="navparlourlogin">Login</v-btn>
    </v-app-bar>

    <!-- Profile Section -->
    <div class="profile-container">
      <v-card class="parlour-profile">
        <v-card-title class="mt-5 ms-4 d-flex justify-space-between">
          <span>Parlour Information</span>
          <div>
            <v-btn 
              color="primary" 
              small 
              @click="openDialog(getListParlour.parlour)"
              :disabled="!getListParlour || !getListParlour.parlour"
            >Edit</v-btn>
            <v-btn 
              color="error" 
              small 
              @click="deleteProfile(getListParlour.parlour)"
              :disabled="!getListParlour || !getListParlour.parlour"
              >Delete</v-btn>
          </div>
        </v-card-title>

        <v-card-text class="py-0">
          <div class="profile-data ms-4">
            <table>
              <tr>
                <td><strong>Parlour Name</strong></td>
                <td>:</td>
                <td>{{ getListParlour.parlour.parlourName }}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>:</td>
                <td>{{ getListParlour.parlour.email }}</td>
              </tr>
              <tr>
                <td><strong>Mobile Number</strong></td>
                <td>:</td>
                <td>{{ getListParlour.parlour.phoneNumber }}</td>
              </tr>
            </table>
          </div>
        </v-card-text>
      </v-card>
    </div>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isEditMode:false,
      // editedCard: {
      //   parlourId: null,
      //   parlourName: '',
      //   email: '',
      //   phoneNumber: '',
      // },
    };
  },
  computed: {
    ...mapGetters('parlour', ['getParlour']),
    parlour() {
      console.log("list",this.parlour);
      return this.getParlour;
    },
  },
  mounted(){
    this.isEditMode = this.$route.query.edit === true;
    if(this.isEditMode){
      this.editDialog = true;
    }
    this.fetchParlour();
    this.$store.dispatch("parlour/listParlour");
  },
  methods: {
    navparlourlogin() {
      this.$router.push({ name: 'parlourLogin' });
    },
    cancelChanges(){
      this.$router.push({ name: 'parlourProfile' });
    },
    openDialog(parlour){
      this.fetchParlour().then(()=>{
        this.editedCard = { ...parlour }; 
        this.editDialog=true;
      })
    },
    // async fetchParlour(){
    //   try{
    //     const payload=this.getListParlour.parlour.id;
    //     console.log("Fetching parlour for:",payload);
    //     const success = await this.$store.dispatch("parlour/listParlour", payload);
    //     if (!success) throw new Error("Failed to fetch parlour");
    //   } catch (error) {
    //     console.error('Failed to fetch parlour:', error);
    //   }
    // },
    editService(service) {
      alert(`Editing service: ${service.itemName}`);
    },
    deleteService(service) {
      alert(`Deleting service: ${service.itemName}`);
    },
    // async editProfile() {
    //   //const payload=this.parlour.id;
    //   try {
    //     const res =  await this.$store.dispatch('parlour/updateParlour',this.editedCard);
    //      if(res) {
    //       alert(`Successfully updated ${this.editedCard.parlourName}`);
    //       this.$store.dispatch('parlour/listParlour');
    //       this.editDialog = false;
    //      }    
    //   } catch (error) {
    //     console.error('Failed to edit parlour:', error);
    //     alert('An error occurred while editing the parlour.');
    //   }
    // },
    // async saveChanges() {
    //   try {
    //     await this.$store.dispatch('parlour/updateParlour', this.editedCard);
    //     this.editDialog = false;
    //     alert('Parlour information updated successfully.');
    //   } catch (error) {
    //     console.error('Failed to update parlour:', error);
    //     alert('An error occurred while updating the parlour.');
    //   }
    // },
    async deleteProfile(profile) {
      const payload=this.getListParlour.parlour.id;
      try {
        const confirmed = await this.$store.dispatch("parlour/deleteParlour", payload);
        if(confirmed){
          alert(`Successfully deleted ${profile.parlourName}`);
          this.$store.dispatch("parlour/listParlour"); // Refresh list
        }
      } catch (error) {
        console.error("Failed to delete parlour:", error);
        alert("An error occurred while deleting the parlour.");
      }
    },
  },
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
