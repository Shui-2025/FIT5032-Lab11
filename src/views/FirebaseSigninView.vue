<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h1 class="text-center mb-0">🔥 Sign in</h1>
          </div>
          <div class="card-body">
            <p class="text-center text-muted mb-4">
              Sign in using Firebase Authentication
            </p>

            <!-- Firebase info -->
            <div class="alert alert-info mb-4">
              <small>
                <strong>🔥 Firebase Login Roles:</strong><br>
                • admin@firebase.com - Administrator<br>
                • librarian@firebase.com - Librarian<br>
                • member@firebase.com - Member<br>
                (Register any email, but these have predefined roles)
              </small>
            </div>

            <!-- Login form -->
            <form @submit.prevent="signin">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                  v-model="email"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                  v-model="password"
                  required
                />
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">
                  🔥 Sign in via Firebase
                </button>
              </div>
            </form>

            <!-- Additional options -->
            <div class="text-center mt-4">
              <p class="text-muted">
                Don't have an account? 
                <router-link to="/FireRegister" class="text-decoration-none">Register here</router-link>
              </p>
              <p class="text-muted">
                <router-link to="/login" class="text-decoration-none">← Back to regular login</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../Firebase/init.js"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const appAuth = inject('auth')

const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log("🔥 Firebase Login Successful!")
      console.log("📧 Email:", auth.currentUser.email)
      console.log("👤 User Object:", auth.currentUser)
      

      const firebaseRoles = {
        'admin@firebase.com': { role: 'Administrator', permissions: ['all'] },
        'librarian@firebase.com': { role: 'Librarian', permissions: ['books', 'users'] },
        'member@firebase.com': { role: 'Member', permissions: ['browse', 'borrow'] }
      }
      
      const userRole = firebaseRoles[auth.currentUser.email] || { 
        role: 'Member', 
        permissions: ['browse'] 
      }

      const user = {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName || `Firebase ${userRole.role}`,
        uid: auth.currentUser.uid,
        role: userRole.role,
        permissions: userRole.permissions,
        provider: 'firebase'
      }
      
      appAuth.isAuthenticated.value = true
      appAuth.currentUser.value = user
      
      localStorage.setItem('library_auth', 'true')
      localStorage.setItem('library_user', JSON.stringify(user))
      
      console.log(`✅ ${userRole.role} authenticated successfully:`, user)
      
      router.push("/")
    }).catch((error) => {
      console.log("❌ Firebase Login Error:", error.code)
      console.log("📝 Error message:", error.message)
    })
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #ff7b00, #ff8c00);
  color: white;
  border-radius: 0.375rem 0.375rem 0 0;
}

.alert-info {
  border-left: 4px solid #0dcaf0;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}
</style>
