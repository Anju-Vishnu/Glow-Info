<template>
  <v-app class="bgimage">
    <v-container>
      <v-card class="pa-5 elevation-12 custom-card">
        <!-- App Bar -->
        <v-app-bar class="custom-gradient" elevation="3">
          <v-icon class="mr-3">fas fa-cut</v-icon>
          <v-app-bar-title class="app-bar-title">Glowinfo</v-app-bar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="gotoHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-app-bar>

        <v-main>
          <v-container>
            <v-row>
              <!-- Employee Form -->
              <v-col cols="12" md="6">
                <v-card class="pa-5 elevation-5">
                  <v-card-title class="text-h6 font-weight-bold">Add Employee</v-card-title>
                  <v-card-text>
                    <v-form ref="form" @submit.prevent="employeeAdd">
                      <v-text-field
                        label="Employee Name"
                        v-model="newEmployee.empName"
                        :rules="[rules.required, rules.onlyLetters]"
                        outlined
                        dense
                      ></v-text-field>
                      <v-file-input
                        label="Add Image"
                        accept="image/*"
                        outlined
                        dense
                        @change="handleFileUpload"
                      ></v-file-input>
                      <v-btn
                        block
                        color="primary"
                        :loading="newEmployee.isLoading"
                        type="submit"
                        :disabled="newEmployee.isLoading"
                        class="mt-3"
                      >
                        <v-icon left>mdi-account-plus</v-icon>
                        Add Employee
                      </v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Employee List -->
              <v-col cols="12" md="6">
                <v-card class="pa-5 elevation-5">
                  <v-card-title class="text-h6 font-weight-bold">Employee List</v-card-title>
                  <v-data-table
                    :headers="tableHeader"
                    :items="listedEmployee"
                    dense
                    class="elevation-1"
                    no-data-text="No employees found"
                  >
                     <!-- Employee ID -->
                  <template v-slot:item.id="{ item }">
                    <span>{{ item.id }}</span>
                  </template>
                
                  <!-- Employee Name -->
                  <template v-slot:item.employeeName="{ item }">
                    <span>{{ item.employeeName }}</span>
                  </template>
                
                  <!-- Availability Toggle Button -->
                  <template v-slot:item.availability="{item}">
                    <v-switch 
                      v-model="item.availability" 
                      color="primary"
                      @change="toggleAvailability(item)"
                    ></v-switch>
                  </template>
                
                  <!-- Edit & Delete Buttons -->
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon small color="primary" @click="openEditDialog(item)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon small color="red" @click="deleteEmployee(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-card>
    </v-container>

    <!-- Edit Employee Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Employee</v-card-title>
        <v-card-text>
          <v-form ref="editForm" @submit.prevent="updateEmployee">
            <v-text-field 
              label="Employee Name" 
              v-model="editData.empName" 
              :rules="[rules.required, rules.onlyLetters]" 
              outlined dense
            ></v-text-field>

            <v-file-input 
              label="Upload Image" 
              accept="image/*" 
              outlined dense 
              @change="handleEditFileUpload"
            ></v-file-input>
            <!-- <v-switch label="Availability" v-model="editData.availability" color="primary"></v-switch> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="primary" @click="updateEmployee">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="successSnackbar" timeout="3000" color="success" elevation="2" bottom>
      {{ successMessage }}
      <template v-slot:action>
        <v-btn color="white" text @click="redirectToEmployeePage">OK</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      employeeList: [], 
      parlourId:"",
      editDialog: false,
      successSnackbar: false,
      successMessage: "",
      newEmployee: {
        id:"",
        empName: "",
        image: null,
        availability: false,
        isLoading: false,
      },
      tableHeader: [
      { text: "ID", value: "id" },
      { text: "Employee Name", value: "employeeName" },
      { text: "Availability", value: "availability" },
      { text: "Actions", value: "actions", sortable: false },
      ],
      editData: {
        empName: "",
        image: null,
        availability: true,
        id: null,
      },
      rules: {
        required: (value) => !!value || "This field is required.",
        onlyLetters: (value) =>
          /^[a-zA-Z\s]+$/.test(value) || "Only letters are allowed.",
      },
    };
  },
  computed: {
    ...mapGetters("parlour", ["getEmployee", "getParlour"]),
    parlour() {
      return this.getParlour;
    },

    listedEmployee(){
      return this.getEmployee.map(employee => ({
        ...employee,
        availability: employee.isAvailable ?? false,
      }));
    },
  },
  mounted() {
    console.log("Fetching employees...");
    console.log("Parlour Data:", this.parlour);
      this.fetchEmployees();
  },
  methods: {
    gotoHome(){
      this.$router.push({ name: 'parlourHome' });
    },
    openEditDialog(employee) {
      this.editData = { 
        id: employee.id,
        empName: employee.employeeName,
        availability: employee.availability,
        image: employee.image,
      };
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editData = { empName: "", image: null, availability: false, id: null };
    },
    // handleFileUpload(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.newEmployee.image = file;
    //     this.newEmployee.imagePreview = URL.createObjectURL(file); 
    //   }
    // },
    handleEditFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editData.image = file;
        this.editData.imagePreview = URL.createObjectURL(file);
      }
    },
    async employeeAdd() {
      try{     
        const formData = new FormData();
        formData.append("employeeName", this.newEmployee.empName);
        formData.append("parlourId", this.parlour.parlour.id);
        
        if (this.newEmployee.image) {
          formData.append("image", this.newEmployee.image);
        }
        // formData.append("availability", this.newEmployee.availability);
      
        const response = await this.$store.dispatch("parlour/addEmployee", formData);

        if (response) {
          console.log("Employee added successfully:", response);
          this.showSuccessSnackbar("Employee added successfully!");
          this.resetForm();

          await this.fetchEmployees(); // ✅ Ensure we fetch the updated list
          console.log("Updated employee list:", this.listEmployee);
        } else {
          console.error("Error: API did not return success.");
        }
      } catch (error) {
        console.error("Error adding employee:", error);
      } finally {
        this.newEmployee.isLoading = false;
      }
    },
    async fetchEmployees() {
      try {
        console.log("Fetching employees for Parlour ID:", this.parlour.parlour.id);

        const response = await this.$store.dispatch("parlour/listEmployee", this.parlour.parlour.id);

        if (response) {
          console.log("Employee list updated:", response);
        } else {
          console.error("Failed to fetch employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error.message || error);
      }
    },
    async updateEmployee() {
      try {
        const formData = new FormData();
        formData.append("id", this.editData.id);
        formData.append("employeeName", this.editData.empName);
        formData.append("parlourId", this.parlour.parlour.id);
              
        if (this.editData.image instanceof File) {
          formData.append("image", this.editData.image);
        }
      
        const response = await this.$store.dispatch("parlour/editEmployee", formData);
      
        if (response) {
          this.showSuccessSnackbar("Employee updated successfully!");
          this.editDialog = false;
          await this.fetchEmployees();
        }
      } catch (error) {
        console.error("Error updating employee:", error.response ? error.response.data : error);
        this.showSuccessSnackbar(error.response?.data?.message || "Failed to update employee.");
      }
    },
    async deleteEmployee(employee) {
      if (confirm("Are you sure you want to delete this employee?")) {
        try {
          const response = await this.$store.dispatch("parlour/deleteEmployee",employee.id);
          if (response) {
            this.showSuccessSnackbar("Employee deleted successfully!");
            await this.fetchEmployees();
          }else{
            console.error("Failed to delete employee.");
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
      }
    },
    
    showSuccessSnackbar(message) {
      this.successMessage = message;
      this.successSnackbar = true;
    },
    async toggleAvailability(employee) {
      try {
        const updatedAvailability = !employee.availability; // Toggle value
      
        const formData = new FormData();
        formData.append("id", employee.id);
        formData.append("availability", updatedAvailability? "true" : "false");
      
        const response = await this.$store.dispatch("parlour/editEmployee", formData);
      
        if (response) {
          employee.availability = updatedAvailability; // Manually update in UI
          this.showSuccessSnackbar("Employee availability updated!");
        } else {
          console.error("Failed to update availability.");
        }
      } catch (error) {
        console.error("Error updating availability:", error);
      }
    },
    resetForm() {
      this.$refs.form.reset();
      this.newEmployee = {
        empName: "",
        image: null,
        availability: false,
        isLoading: false,
      };
      this.$refs.fileInput.value = ""; 
    },

    redirectToEmployeePage() {
      this.successSnackbar = false;
      this.$router.push({name: 'parlourEmployee'});
    },
  },
};
</script>

<style scoped>
.bgimage {
  background-image: url("@/assets/beauty3.jpg");
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-card {
  max-width: 900px;
  margin: auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  overflow: hidden;
}

.custom-gradient {
  background: linear-gradient(135deg, #f575c0, #d8794d);
  color: white;
}

.app-bar-title {
  font-size: 24px;
  font-weight: bold;
  font-family: 'Lucida Sans', sans-serif;
}

.v-btn {
  text-transform: none;
  font-weight: bold;
}

.v-data-table {
  background: white;
  border-radius: 10px;
}

.v-chip {
  font-weight: bold;
}

.v-card {
  border-radius: 12px;
}
</style>
