<script setup>
import { ref, inject } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import FirestoreDemo from '../components/FirestoreDemo.vue'
import DataQueryComponent from '../components/DataQueryComponent.vue'

const auth = inject('auth')

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: ''
})

const submittedCards = ref([])

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: ''
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})

const reasonMessage = ref(null)

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateReason = () => {
  const reason = formData.value.reason.toLowerCase()
  if (reason.includes('friend')) {
    reasonMessage.value = 'Great to have a friend'
  } else {
    reasonMessage.value = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.confirmPassword !== formData.value.password) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = null
  }
}
</script>

<template>
  <!-- 🗄️ W5. Library Registration Form -->
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ W5. Library Registration Form</h1>
        <p class="text-center">
          Let's build some more advanced features into our form.
        </p>
        
        <!-- Authentication status message with role info -->
        <div v-if="auth.isAuthenticated.value" class="alert alert-success text-center mb-4">
          <strong>Welcome back, {{ auth.currentUser.value?.name }}!</strong><br>
          <span v-if="auth.currentUser.value?.role">
            Role: <span class="badge bg-primary">{{ auth.currentUser.value.role }}</span>
          </span>
          <span v-if="auth.currentUser.value?.provider === 'firebase'" class="badge bg-warning ms-2">
            🔥 Firebase User
          </span>
          <br>
          <small class="text-muted">{{ auth.currentUser.value?.email }}</small>
          
          <!-- Role permissions display -->
          <div v-if="auth.currentUser.value?.permissions" class="mt-2">
            <small class="text-muted">Permissions: </small>
            <span v-for="permission in auth.currentUser.value.permissions" :key="permission" 
                  class="badge bg-secondary me-1">{{ permission }}</span>
          </div>
        </div>
        
        <!-- Role demonstration section -->
        <div v-if="auth.isAuthenticated.value" class="alert alert-info mb-4">
          <h6 class="alert-heading">🎭 Multi-Role System Active</h6>
          <p class="mb-2">Your current role determines what features you can access:</p>
          <ul class="mb-0">
            <li v-if="auth.currentUser.value?.permissions?.includes('all')">
              <strong>Administrator:</strong> Full system access, user management, reports
            </li>
            <li v-if="auth.currentUser.value?.permissions?.includes('books')">
              <strong>Library Management:</strong> Add/edit books, manage catalog
            </li>
            <li v-if="auth.currentUser.value?.permissions?.includes('users')">
              <strong>User Management:</strong> View and manage user accounts
            </li>
            <li v-if="auth.currentUser.value?.permissions?.includes('browse')">
              <strong>Browse:</strong> Search and view library catalog
            </li>
            <li v-if="auth.currentUser.value?.permissions?.includes('borrow')">
              <strong>Borrowing:</strong> Borrow and return books
            </li>
          </ul>
        </div>
        <div v-else class="alert alert-info text-center mb-4">
          <strong>Guest Mode:</strong> You can still register, but consider 
          <router-link to="/login" class="alert-link">logging in</router-link> for a personalized experience.
        </div>
        <form @submit.prevent="submitForm">
          <!-- ...existing form content... -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                @blur="() => validateConfirmPassword(true)"
                v-model="formData.confirmPassword"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              @input="validateReason"
              v-model="formData.reason"
            ></textarea>
            <div v-if="reasonMessage" class="text-success">{{ reasonMessage }}</div>
          </div>
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input
              type="text"
              class="form-control"
              id="suburb"
              v-model="formData.suburb"
              placeholder="Enter your suburb"
            />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12">
        <h4>This is a Primevue Datatable.</h4>
        <DataTable :value="submittedCards" tableStyle="min-width: 50rem">
          <Column field="username" header="Username"></Column>
          <Column field="password" header="Password"></Column>
          <Column field="isAustralian" header="Australian Resident"></Column>
          <Column field="gender" header="Gender"></Column>
          <Column field="suburb" header="Suburb"></Column>
          <Column field="reason" header="Reason"></Column>
        </DataTable>
      </div>
    </div>

    <div class="row mt-5" v-if="submittedCards.length">
      <div class="col-12">
        <div class="d-flex flex-wrap justify-content-start">
          <div
            v-for="(card, index) in submittedCards"
            :key="index"
            class="card m-2"
            style="width: 18rem"
          >
            <div class="card-header">User Information</div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Username: {{ card.username }}</li>
              <li class="list-group-item">Password: {{ card.password }}</li>
              <li class="list-group-item">
                Australian Resident: {{ card.isAustralian ? 'Yes' : 'No' }}
              </li>
              <li class="list-group-item">Gender: {{ card.gender }}</li>
              <li class="list-group-item">Suburb: {{ card.suburb }}</li>
              <li class="list-group-item">Reason: {{ card.reason }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Firestore Demo Section -->
  <FirestoreDemo v-if="auth.isAuthenticated.value" />
  
  <!-- Data Query Component Section -->
  <DataQueryComponent v-if="auth.isAuthenticated.value" />
</template>

<style>
</style>
