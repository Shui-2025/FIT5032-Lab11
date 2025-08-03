<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = inject('auth')

const loginData = ref({
  email: '',
  password: ''
})

const errors = ref({
  email: null,
  password: null,
  general: null
})

const isLoading = ref(false)

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!loginData.value.email) {
    if (blur) errors.value.email = 'Email is required'
  } else if (!emailPattern.test(loginData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  if (!loginData.value.password) {
    if (blur) errors.value.password = 'Password is required'
  } else if (loginData.value.password.length < 6) {
    if (blur) errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = null
  }
}

const handleSubmit = async () => {
  // Clear any previous general errors
  errors.value.general = null
  
  // Validate all fields
  validateEmail(true)
  validatePassword(true)
  
  // Check if there are any validation errors
  if (errors.value.email || errors.value.password) {
    return
  }
  
  isLoading.value = true
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Attempt authentication
    const result = auth.login(loginData.value.email, loginData.value.password)
    
    if (result.success) {
      // Clear form
      clearForm()
      
      // Check if there's a redirect URL from the route query
      const redirect = router.currentRoute.value.query.redirect || '/'
      
      // Navigate to the intended destination or home page
      router.push(redirect)
    } else {
      // Show authentication error
      errors.value.general = result.error
    }
    
  } catch (error) {
    console.error('Login error:', error)
    errors.value.general = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const clearForm = () => {
  loginData.value = {
    email: '',
    password: ''
  }
  errors.value = {
    email: null,
    password: null,
    general: null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h2 class="text-center mb-0">🔐 Login to Library</h2>
          </div>
          <div class="card-body">
            <p class="text-center text-muted mb-4">
              Please enter your credentials to access your library account
            </p>

            <!-- Demo credentials info with multiple roles -->
            <div class="alert alert-info mb-4">
              <small>
                <strong>🎭 Multi-Role Demo Credentials:</strong><br>
                <strong>Administrator:</strong> admin@library.com / library123<br>
                <strong>Librarian:</strong> librarian@library.com / librarian123<br>
                <strong>Staff:</strong> staff@library.com / staff123<br>
                <strong>Member:</strong> user@library.com / user123
              </small>
            </div>

            <!-- General authentication error -->
            <div v-if="errors.general" class="alert alert-danger mb-4">
              {{ errors.general }}
            </div>
            
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="loginData.email"
                  @blur="() => validateEmail(true)"
                  @input="() => validateEmail(false)"
                  placeholder="Enter your email"
                  :disabled="isLoading"
                />
                <div v-if="errors.email" class="text-danger mt-1">
                  {{ errors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="loginData.password"
                  @blur="() => validatePassword(true)"
                  @input="() => validatePassword(false)"
                  placeholder="Enter your password"
                  :disabled="isLoading"
                />
                <div v-if="errors.password" class="text-danger mt-1">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <label class="form-check-label" for="rememberMe">
                  Remember me
                </label>
              </div>

              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isLoading ? 'Signing in...' : 'Sign In' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-outline-secondary"
                  @click="clearForm"
                  :disabled="isLoading"
                >
                  Clear Form
                </button>
              </div>
            </form>

            <div class="text-center mt-4">
              <p class="mb-2">
                <a href="#" class="text-decoration-none">Forgot your password?</a>
              </p>
              <p class="text-muted">
                Don't have an account? 
                <router-link to="/" class="text-decoration-none">Register here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Page-specific styles can be added here if needed */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
