<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const auth = inject('auth')
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container-fluid bg-light">
    <div class="container">
      <header class="d-flex justify-content-between align-items-center py-3">
        <!-- Left side navigation -->
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" aria-current="page"
              >Home (Week 5)</router-link
            >
          </li>
          <!-- About page is only accessible to authenticated users -->
          <li v-if="auth.isAuthenticated.value" class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">About</router-link>
          </li>
          <!-- Add Book page is only accessible to authenticated users -->
          <li v-if="auth.isAuthenticated.value" class="nav-item">
            <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
          </li>
          <!-- Query page is only accessible to authenticated users -->
          <li v-if="auth.isAuthenticated.value" class="nav-item">
            <router-link to="/query" class="nav-link" active-class="active">🔍 Query Data</router-link>
          </li>
          <!-- Book Management page is only accessible to authenticated users -->
          <li v-if="auth.isAuthenticated.value" class="nav-item">
            <router-link to="/manage-books" class="nav-link" active-class="active">📚 Manage Books</router-link>
          </li>
          <!-- Show disabled About link for unauthenticated users with tooltip -->
          <li v-else class="nav-item">
            <span 
              class="nav-link text-muted" 
              style="cursor: not-allowed;" 
              title="Please login to access the About page"
            >
              About 🔒
            </span>
            <span 
              class="nav-link text-muted" 
              style="cursor: not-allowed;" 
              title="Please login to add books"
            >
              📚 Add Book 🔒
            </span>
            <span 
              class="nav-link text-muted" 
              style="cursor: not-allowed;" 
              title="Please login to query data"
            >
              🔍 Query 🔒
            </span>
            <span 
              class="nav-link text-muted" 
              style="cursor: not-allowed;" 
              title="Please login to manage books"
            >
              📚 Manage 🔒
            </span>
          </li>
          <!-- Get Weather page -->
          <li class="nav-item">
            <router-link to="/WeatherCheck" class="nav-link" active-class="active">Get Weather</router-link>
          </li>
          <!-- Count Book API page -->
          <li class="nav-item">
            <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link>
          </li>
          <!-- Get All Books API page -->
          <li class="nav-item">
            <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Books API</router-link>
          </li>
        </ul>

        <!-- Right side authentication -->
        <div class="d-flex align-items-center">
          <!-- Authenticated user section -->
          <div v-if="auth.isAuthenticated.value" class="d-flex align-items-center">
            <span class="text-success me-3">
              <i class="bi bi-person-check"></i>
              Welcome, {{ auth.currentUser.value?.name }}!
              <span v-if="auth.currentUser.value?.role" class="badge bg-primary ms-2">
                {{ auth.currentUser.value.role }}
              </span>
              <span v-if="auth.currentUser.value?.provider === 'firebase'" class="badge bg-warning ms-1">
                🔥 Firebase
              </span>
            </span>
            <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
          <!-- Unauthenticated user section -->
          <div v-else class="d-flex align-items-center">
            <span class="text-muted me-3">
              <i class="bi bi-person-x"></i>
              Not logged in
            </span>
            <div class="btn-group" role="group">
              <router-link to="/login" class="btn btn-primary btn-sm">
                <i class="bi bi-box-arrow-in-right"></i>
                Login
              </router-link>
              <router-link to="/FireLogin" class="btn btn-outline-warning btn-sm">
                🔥 Firebase
              </router-link>
              <router-link to="/FireRegister" class="btn btn-outline-success btn-sm">
                📝 Register
              </router-link>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
