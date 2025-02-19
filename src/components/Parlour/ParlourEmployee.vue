<template>
  <v-app class="bgimage">
    <v-card class="mx-auto">
      <!-- App Bar -->
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
                    v-model="newEmployee.image"
                    outlined
                  ></v-file-input>

                  <v-checkbox
                    label="Availability"
                    v-model="newEmployee.availability"
                  ></v-checkbox>

                  <v-btn
                    :loading="newEmployee.isLoading"
                    color="green"
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
                    v-if="employee.img"
                    :src="employee.img"
                    max-height="80px"
                    max-width="80px"
                    class="custom-image"
                  ></v-img>
                  <div v-else>No image uploaded</div>
                </div>
                <div class="table-cell actions">
                  <v-btn color="primary" @click="openEditDialog(employee)">Edit</v-btn>
                  <v-btn color="red" @click="() => deleteEmployee(employee)">Delete</v-btn>
                </div>
              </div>
            </div>

            <!-- Employee Edit Dialog -->
            <v-dialog v-model="editDialog" max-width="500px">
              <v-card>  <!-- Prevent undefined access -->
                <v-card-title>
                  <span class="text-h5">Edit Employee</span>
                </v-card-title>
                <v-card-text>
                  <v-form ref="editForm">
                    <v-text-field v-model="editData.empName" label="Employee Name" required></v-text-field>

                    <v-file-input label="Change Image" accept="image/*" v-model="editData.image"></v-file-input>

                    <v-switch v-model="editData.availability" label="Available"></v-switch>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="grey" @click="editDialog = false">Cancel</v-btn>
                  <v-btn color="green" @click="updateEmployee">Save</v-btn>
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
      editDialog: false,
      successSnackbar: false,
      successMessage: "",
      newEmployee: {
        empName: "",
        image: null,
        availability: false,
        isLoading: false,
      },
      editData: {
        id: null,
        empName: "",
        image: null,
        availability: false,
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
    listEmployee() {
      return this.getEmployee ? this.getEmployee.map((employee) => ({ ...employee })) : [];
    },
  },
  mounted() {
    this.fetchEmployees();
  },
  methods: {
    openEditDialog(employee) {
      this.editData = { ...employee};
      this.editDialog = true;
    },
    async updateEmployee() {
      try {
        const payload = {
          id: this.editData.id,
          empName: this.editData.empName,
          availability: this.editData.availability,
        };

        const success = await this.$store.dispatch("parlour/editEmployee", payload);

        if (success) {
          this.showSuccessSnackbar("Employee updated successfully!");
          this.editDialog = false;
          await this.fetchEmployees();
        } else {
          console.error("Failed to update employee.");
        }
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    },
    async fetchEmployees() {
      try {
        const parlourId = this.parlour.parlour.id;
        if (parlourId) {
          await this.$store.dispatch("parlour/listEmployee", parlourId);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    async deleteEmployee(employee) {
      if (confirm("Are you sure you want to delete this employee?")) {
        try {
          const response = await this.$store.dispatch("parlour/deleteEmployee", employee.id);
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
    redirectToEmployeePage() {
      this.successSnackbar = false;
      this.$router.push("/employee");
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
.table-header {
  display: flex;
  background-color: #e0e0e0;
  font-weight: bold;
  margin-top: 30px;
}

.table-body .table-row {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 8px 0;
}

/* Table Cell Styling */
.table-cell {
  flex: 1;
  padding: 10px;
  text-align: center;
  border-right: 1px solid #ccc;
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
</style>
