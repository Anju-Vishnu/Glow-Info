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

        <v-container fluid>
          <v-card class="maintable mx-auto" style="padding: 20px;">
            <v-card-title class="d-flex justify-content-between align-items-center">
              <h5>Employee Details</h5>
              <v-btn color="blue" @click="openDialog('add')">Add Employee</v-btn>
            </v-card-title>
            <v-card-text>
              <div class="custom-table">
                <!-- Table Header -->
                <div class="table-header">
                  <div class="table-cell header">Employee Name</div>
                  <div class="table-cell header">Image</div>
                  <!-- <div class="table-cell header">Service</div> -->
                  <div class="table-cell header">Attendance</div>
                  <div class="table-cell header">Actions</div>
                </div>

                <!-- Table Body -->
                <div class="table-body">
                  <div class="table-row" v-for="(employee, index) in employees" :key="index">
                    <div class="table-cell">{{ employee.empName }}</div>
                    <div class="table-cell">
                      <v-img 
                        v-if="employee.imagePreview" 
                        :src="employee.imagePreview" 
                        alt="Employee Image"
                        style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;"
                      ></v-img>
                      <span v-else>No Image</span>
                    </div>
                    <div class="table-cell">
                      {{ employee.attendance ? 'Present' : 'Absent' }}
                      <v-icon
                        @click="toggleAttendance(index)"
                        :color="employee.attendance ? 'green' : 'red'"
                      >
                        {{ employee.attendance ? 'mdi-check-circle' : 'mdi-cancel' }}
                      </v-icon>
                    </div>
                    <div class="table-cell actions">
                      <v-btn icon small color="green" @click="openDialog('edit', index)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon small color="red" @click="deleteEmployee(index)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ dialogMode === 'add' ? 'Add' : 'Edit' }} Employee</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="employeeForm" v-model="isValid">
                <v-text-field 
                  v-model="formData.empName" 
                  label="Employee Name"
                  :rules="[rules.required, rules.onlyLetters]"
                  required
                ></v-text-field>
                <v-file-input
                  label="Upload Employee Image"
                  accept="image/*"
                  @change="handleImageUpload"
                  show-size
                  required
                ></v-file-input>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="saveEmployee">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      employees: [], // Initialize employees array
      dialog: false,
      dialogMode: 'add',
      currentIndex: null,
      formData: {
        empName: '',
        image: null,
        imagePreview: null,
        attendance: false,
      },
      isValid: false,
      rules: {
        required: value => !!value || 'This field is required.',
        onlyLetters: value => /^[a-zA-Z\s]+$/.test(value) || 'Only letters are allowed.',
      },
    };
  },
  methods: {
    deleteEmployee(index){
      console.log("Deleting employee at index:", index);
      this.employees.splice(index,1);
    },
    toggleAttendance(index) {
    this.employees[index].attendance = !this.employees[index].attendance;  
    },
    openDialog(mode, index = null) {
      this.dialogMode = mode;
      this.dialog = true;
      if (mode === 'edit') {
        this.currentIndex = index;
        this.formData = { ...this.employees[index] }; // Copy existing data for editing
      } else {
        this.formData = { empName: '', image: null, imagePreview: null }; // Reset form for new entry
      }
    },
    handleImageUpload(event) {
      // Access the uploaded file from the event target
      const file = event.target.files ? event.target.files[0] : null;

      if (file && file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.imagePreview = e.target.result; // Save base64 for preview
          console.log("Image Preview Data:", this.formData.imagePreview); // Check in console
        };
        reader.readAsDataURL(file); // Convert file to base64
      } else {
        console.error("Invalid or missing file:", file); // Log if no valid file
      }
    },
    saveEmployee() {
      if (!this.isValid) return;

      const employeeData = { ...this.formData };
      employeeData.attendance= this.dialogMode === 'add' ? false: employeeData.attendance;
      
      if (this.dialogMode === 'add') {
        this.employees.push(employeeData); // Add new employee
      } else if (this.dialogMode === 'edit' && this.currentIndex !== null) {
        this.employees.splice(this.currentIndex, 1, employeeData); // Update existing employee
      }
      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.formData = { empName: '', image: null, imagePreview: null };
    },
  },
};
</script>

<style scoped>
 .app-bar-title {
  margin-left: 2px;
  font-size: 30px;
  font-weight: 800;
  font-family: 'Lucida Sans', sans-serif;
}
.custom-gradient {
  background-image: linear-gradient(135deg, #ff7e5f, #feb47b);
}

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
</style>
