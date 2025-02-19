<template>
  <v-app>
    <!-- App Bar Section -->
    <v-app-bar color="brown-darken-4" class="custom-gradient">
      <template #prepend>
        <v-icon>fas fa-cut</v-icon>
      </template>
      <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-card>
        <v-container fluid>
          <v-card class="w-100" max-width="650">
            <v-card-title>Registration Status</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="mt-5">
                  <v-img 
                    :src="parlour.image ? 'data:image/png;base64,' + parlour.image : defaultProfileImage" 
                    alt="Profile Photo"
                  ></v-img>
                </v-col>
                <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="mb-1">Status:</v-list-item-title>
                        <v-btn :class="statusClass">{{ statusText }}</v-btn>
                      </v-list-item-content>
                    </v-list-item>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters("parlour", ["getParlour"]),

    parlour() {
      return this.getParlour || {};
    },

    statusText() {
      return ["Denied", "Approved", "Waiting"][this.registrationDetails.status] || "Unknown";
    },

    statusClass() {
      return ["status-denied", "status-approved", "status-waiting"][this.registrationDetails.status] || "status-unknown";
    }
  },

  methods: {
    async approveParlour(){
      const payload = this.parlour.parlour.id;
      const success =  await this.$store.dispatch("parlour/confirmApprove", payload)
    
      if(success){
        this.$toast.success("Parlour Approved");
        this.$router.push('/parlourHome');
      }else{
        this.$toast.error("Failed to approve the parlour. Try again.");
      }
    },
  }
};
</script>

<style scoped>
.v-img {
  width: 100%;
  height: auto;
}

.status-denied {
  background-color: red;
  color: white;
}

.status-approved {
  background-color: green;
  color: white;
}

.status-waiting {
  background-color: orange;
  color: white;
}

.status-unknown {
  background-color: gray;
  color: white;
}
</style>
