<template>
  <v-app style="background-color: #feb47b; width: 100%; max-width: 1600px;">
    <v-container fluid>
      <v-card class="mx-auto" color="grey-lighten-3" max-width="1208">
        <!-- App Bar Section -->
        <v-app-bar color="teal-darken-4" class="custom-gradient">
          <template v-slot:prepend>
            <i class="fas fa-cut"></i>
          </template>
          <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
          <v-spacer></v-spacer>
        </v-app-bar>
  
        <!-- Content Section -->
        <v-container fluid class="d-flex flex-column h-100 align-items-center">
          <v-card class="maintable" style="width: 90%; padding: 20px;">
            <v-card-title class="d-flex justify-content-between align-items-center w-100 ms-4 mt-3 pt-4">
              <h5>Appointment Status</h5>
              <v-select
                variant="outlined"
                v-model="selectedPeriod"
                :items="['Daily', 'Weekly', 'Monthly']"
                label="Select Period"
                class="select mb-3"
              ></v-select>
            </v-card-title>
            <v-card-text>
              <hr>
              <div class="service-table">
                <div class="table-header">
                  <div class="table-cell">Client Name</div>
                  <div class="table-cell">Service</div>
                  <div class="table-cell">Assistant</div>
                  <div class="table-cell">Date</div>
                  <div class="table-cell">Time</div>
                  <div class="table-cell">Actions</div>
                </div>
                <div class="table-body">
                  <div v-if="filteredServices.length === 0" class="empty-state">
                    No appointments found for the selected period.
                  </div>
                  <div
                    class="table-row"
                    v-for="(service, index) in filteredServices"
                    :key="index"
                  >
                    <div class="table-cell">{{ service.clientName }}</div>
                    <div class="table-cell">{{ service.service }}</div>
                    <div class="table-cell">{{ service.assistant }}</div>
                    <div class="table-cell">{{ service.date }}</div>
                    <div class="table-cell">{{ service.time }}</div>
                    <div class="table-cell">
                      <button
                        class="btn btn-primary"
                        @click="markStart(index)"
                        v-if="service.status === 'Waiting'"
                      >
                        Start
                      </button>
                      <button
                        class="btn btn-warning"
                        @click="markInProgress(index)"
                        v-if="service.status === 'Start'"
                      >
                        In Progress
                      </button>
                      <button
                        class="btn btn-success"
                        @click="markComplete(index)"
                        v-if="service.status === 'In Progress'"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </v-card>
    </v-container>
  </v-app>
  </template>
  
  
  <script>
  export default {
    name: 'parlourAppointment',
    data() {
      return {
        selectedPeriod: 'Monthly',
        services: [
          {
            clientName: 'Maya',
            service: 'Spa',
            assistant: 'Anju',
            date:'19/12/2024',
            time: '09:00 AM',
            status: 'Waiting' // Possible statuses: Waiting, In Progress, Completed
          },
          {
            clientName: 'Vinu',
            service: 'Facial',
            assistant: 'Priya',
            date:'25/12/2024',
            time: '11:30 AM',
            status: 'Waiting' // Possible statuses: Waiting, In Progress, Completed
          },
          {
            clientName: 'Vidhya',
            service: 'Nail Art',
            assistant: 'Pooja',
            date:'23/12/2024',
            time: '10:30 AM',
            status: 'Waiting' // Possible statuses: Waiting, In Progress, Completed
          },
          {
            clientName: 'Sandra',
            service: 'Hair Cut',
            assistant: 'Payal',
            date:'30/12/2024',
            time: '11:30 AM',
            status: 'Waiting' // Possible statuses: Waiting, In Progress, Completed
          },
        ],
      };
    },
    computed: {
      filteredServices() {
        const today = new Date();
        const weekFromToday = new Date(today);
        weekFromToday.setDate(today.getDate() + 7);

        return this.services.filter((service) => {
          // Convert `dd/MM/yyyy` to `Date` object
          const [day, month, year] = service.date.split('/').map(Number); // Split and convert parts to numbers
          const serviceDate = new Date(year, month - 1, day); // Create a valid Date object
        
          if (isNaN(serviceDate)) {
            console.warn(`Invalid date format for service: ${service.date}`);
            return false; // Skip invalid dates
          }
        
          if (this.selectedPeriod === 'Daily') {
            return serviceDate.toDateString() === today.toDateString();
          } else if (this.selectedPeriod === 'Weekly') {
            return serviceDate >= today && serviceDate <= weekFromToday;
          } else if (this.selectedPeriod === 'Monthly') {
            return (
              serviceDate.getMonth() === today.getMonth() &&
              serviceDate.getFullYear() === today.getFullYear()
            );
          }
          return true;
        });
      },
    },
    methods: {
      markStart(index) {
        this.services[index].status = 'Start';
      },
      markInProgress(index) {
        this.services[index].status = 'In Progress';
      },
      markComplete(index){
        this.services.splice(index,1);
      },
    }
  };
  </script>
  
  <style scoped>
  .main-table {
    width: 100px;
    max-width: 650px;
    background-color: #125ac7;
  }
  
  .service-table {
    border: 1px solid #e02929;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
  }
  
  .table-header, .table-row {
    display: flex;
    padding: 10px;
  }
  
  .table-header .table-cell {
    background-color: #080808;
    color: white;
  }
  
  .table-cell {
    flex: 1;
    padding: 10px;
    font-size: 16px; /* Adjusted font size for better readability */
    color: #0f0101;
  }
  
  .table-body {
    display: flex;
    flex-direction: column;
    background-color: #ac7a1e;
  }
  
  .table-row {
    border-top: 1px solid #070707;
    background-color: white;
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    cursor: pointer;
  }
  
  .btn-warning {
    background-color: #070707;
    color: white;
    border: none;
  }
  
  .btn-primary {
    background-color: #059b14;
    color: white;
    border: none;
  }
  
  button {
    margin-right: 30px;
  }
  :deep(.select .v-input__control){
    width:150px;
    /* margin-left:975px;
    margin-bottom: 150px; */
  }
  :deep(.select.v-input){
    display: flex;
    justify-content: end;
  }
  .custom-gradient {
    background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
  }

  @media (max-width: 768px) {
  .table-row {
    flex-direction: column;
  }
}

  </style>
  