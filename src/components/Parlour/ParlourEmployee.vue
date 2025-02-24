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
      </v-app-bar>

      <v-main>
        <v-card width="750px" class="text-black mx-auto">
          <v-container fluid>
            <!-- Employee Form -->
            <v-card class="pa-4 mb-4">
              <v-card-title>
                <h5>Add Employee</h5>
              </v-card-title>
              <v-card-text>
                <v-form ref="form" @submit.prevent="employeeAdd">
                  <v-text-field
                    label="Employee Name"
                    v-model="newEmployee.empName"
                    :rules="[rules.required, rules.onlyLetters]"
                    required
                  ></v-text-field>
                  <v-file-input
                    label="Add Image"
                    accept="image/*"
                    outlined
                    @change="handleFileUpload"
                  ></v-file-input>
                  <!-- <v-checkbox
                    label="Availability"
                    v-model="newEmployee.availability"
                  ></v-checkbox> -->
                  <v-btn
                    :loading="newEmployee.isLoading"
                    color="blue"
                    type="submit"
                    :disabled="newEmployee.isLoading"
                  >
                    Add Employee
                  </v-btn>
                 </v-form>
              </v-card-text>
            </v-card>

            <!-- Employee Table -->
            <div class="employee-table mt-4">
              <div class="table-header">
                <div class="table-cell">Id</div>
                <div class="table-cell">Employee Name</div>
                <div class="table-cell">Image</div>
                <div class="table-cell">Availability</div>
                <div class="table-cell">Actions</div>
              </div>

              <div v-if="listEmployee.length === 0" class="empty-state">
                No employee found.
              </div>
              <div class="table-row" v-for="(employee, index) in listEmployee" :key="index">
                <div class="table-cell">{{ employee.id }}</div>
                <div class="table-cell">{{ employee.empName }}</div>
                <div class="table-cell">
                  <v-img
                    v-if="employee.image"
                    :src="employee.image"
                    max-height="80px"
                    max-width="80px"
                    class="custom-image"
                  ></v-img>
                  <div v-else>No image uploaded</div>
                </div>
                <!-- Availability Button -->
                <div class="table-cell">
                  <v-btn 
                    :color="employee.availability ? 'green' : 'red'"
                    @click="toggleAvailability(employee)"
                  >
                    {{ employee.availability ? 'Available' : 'Unavailable' }}
                  </v-btn>
                </div>
                <div class="table-cell actions">
                  <v-btn color="primary" @click="openEditDialog(employee)">Edit</v-btn>
                  <v-btn color="red" @click="deleteEmployee(employee)">Delete</v-btn>
                  <!-- Employee Edit Dialog -->
                  <v-dialog v-model="editDialog" max-width="500px">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Edit Employee</span>
                      </v-card-title>
                      <v-card-text>
                        <v-form ref="editForm">
                          <v-text-field v-model="editData.empName" label="Employee Name" required></v-text-field>
                          <v-file-input label="Change Image" accept="image/*" @change="handleEditFileUpload" ></v-file-input>
                          <!-- <v-switch v-model="editData.availability" label="Available" ></v-switch> -->
                        </v-form>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
                        <v-btn color="green" @click="updateEmployee">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
              </div>
            </div>

           <!-- Success Snackbar -->
            <v-snackbar
              v-model="successSnackbar"
              timeout="3000"
              color="success"
              elevation="2"
              bottom
            >
              {{ successMessage }}
              <template v-slot:action>
                <v-btn color="white" text @click="redirectToEmployeePage"
                  >OK</v-btn
                >
              </template>
            </v-snackbar>
          </v-container>
        </v-card>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      parlourId:"",
      editDialog: false,
      successSnackbar: false,
      successMessage: "",
      newEmployee: {
        id:"",
        empName: "",
        image: null,
        // availability: false,
        isLoading: false,
      },
      tableHeader: [
      { text: "Employee ID", value: "id" },
      { text: "Employee Name", value: "employeeName" },
      { text: "Image", value: "image" },
      { text: "Availability", value: "availability" },
      ],
      editData: {
        empName: "",
        image: null,
        availability: false,
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

    listEmployee(){
      console.log(this.getEmployee); 
      return this.getEmployee.map(employee => ({
        ...employee,
        image: employee.img || employee.image || null,
      }));
    },
  },
  mounted() {
    console.log("Fetching employees...");
    console.log("Parlour Data:", this.parlour);
      this.fetchEmployees();
  },
  methods: {
    openEditDialog(employee){
      this.editData = { ...employee }; // Copy data to prevent modifying original before save
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.editData = { empName: "", image: null, availability: false, id: null };
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newEmployee.image = file;
        this.newEmployee.imagePreview = URL.createObjectURL(file); 
      }
    },
    handleEditFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editData.image = file;
        this.editData.imagePreview = URL.createObjectURL(file);
      }
    },
    async employeeAdd() {
      console.log("Add Employee button clicked!");
      this.newEmployee.isLoading = true;

      try {
        if (!this.parlour || !this.parlour.parlour?.id) {
          throw new Error("Invalid parlour data.");
        }
      
        const formData = new FormData();
        formData.append("parlourId", this.parlour.parlour.id);
        formData.append("empName", this.newEmployee.empName);
        if (this.newEmployee.image) {
          formData.append("image", this.newEmployee.image);
        }
        // formData.append("availability", this.newEmployee.availability);
      
        const response = await this.$store.dispatch("parlour/addEmployee", formData);
        console.log("Response from API:", response);
      
        if (response && response.success) {
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
        if (!this.parlour || !this.parlour.parlour?.id) {
          console.warn("Parlour ID is missing, cannot fetch employees.");
          return;
        }
        const payload = this.parlour.parlour.id
      
        if(payload){
          await this.$store.dispatch("parlour/listEmployee", payload);
          console.log("Employees fetched successfully",this.listEmployee);
        } else {
          console.warn("Parlour ID is missing, cannot fetch employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async updateEmployee() {
      try {
        const formData = new FormData();
        formData.append("id", this.editData.id); // Ensure ID is included
        formData.append("empName", this.editData.empName);
        formData.append("availability", this.editData.availability);

        if (this.editData.image instanceof File) {
          formData.append("image", this.editData.image);
        }

        const success = await this.$store.dispatch("parlour/editEmployee",formData);
        if (success) {
          this.showSuccessSnackbar("Employee updated successfully!");
          this.editDialog = false;
          await this.fetchEmployees();
        } 
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    },
    async deleteEmployee(employee) {
      if (confirm("Are you sure you want to delete this employee?")) {
        try {
          const response = await this.$store.dispatch("parlour/deleteEmployee",employee.id);
          if (response.success) {
            await this.fetchEmployees();
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
        employee.availability = !employee.availability; // Toggle value
      
        const formData = new FormData();
        formData.append("id", employee.id);
        formData.append("empName", employee.empName);
        formData.append("availability", employee.availability);
      
        if (employee.image) {
          formData.append("image", employee.image);
        }
      
        const response = await this.$store.dispatch("parlour/editEmployee", formData);
        if (response) {
          this.showSuccessSnackbar("Employee availability updated!");
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
 /* Table Container */
.custom-table {
  width: 100%;
  border-collapse: collapse;
}

/* Table Header Styling */
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
  
.header {
  font-size: 16px;
  font-weight: bold;
  background-color: #d3d3d3;
}

/* Remove the last border for each row */
.table-cell:last-child {
  border-right: none;
}

.actions {
  display: flex;
  justify-content: center;
}

.v-icon {
  cursor: pointer;
  font-size: 24px;
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
.employee-table {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  background: white;
}
.table-cell {
  flex: 1;
  padding: 8px;
  text-align: left;
}
.table-body {
  display: flex;
  flex-direction: column;
}
.table-row:hover {
  background-color: #f5f5f5;
}
</style>
