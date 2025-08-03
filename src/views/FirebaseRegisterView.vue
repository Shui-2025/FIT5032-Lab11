<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h1 class="text-center mb-0">🔥 Create an Account</h1>
          </div>
          <div class="card-body">
            <p class="text-center text-muted mb-4">
              Register a new account with Firebase Authentication
            </p>

            <!-- Firebase setup info -->
            <div class="alert alert-info mb-4">
              <small>
                <strong>🚀 Firebase Registration:</strong><br>
                Create your account to access all features.<br>
                Your account will be securely stored in Firebase.
              </small>
            </div>

            <!-- Registration form -->
            <form @submit.prevent="register">
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
                  Save to Firebase
                </button>
              </div>
            </form>

            <!-- Additional options -->
            <div class="text-center mt-4">
              <p class="text-muted">
                Already have an account? 
                <router-link to="/FireLogin" class="text-decoration-none">Sign in here</router-link>
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
import { ref } from "vue"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../Firebase/init.js"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log("Firebase Register Successful!")
      router.push("/FireLogin")
    })
    .catch((error) => {
      console.log(error.code)
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
