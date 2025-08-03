<script setup>
import { inject } from 'vue'

const auth = inject('auth')
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <!-- Protected content for authenticated users -->
        <div v-if="auth.isAuthenticated.value" class="card">
          <div class="card-header">
            <h1 class="text-center mb-0">📚 About Our Library</h1>
          </div>
          <div class="card-body">
            <!-- Personalized welcome message -->
            <div class="alert alert-success mb-4">
              <h4 class="alert-heading">Welcome, {{ auth.currentUser.value?.name }}! 🎉</h4>
              <p class="mb-0">
                You are now accessing the exclusive About page. This content is only available to authenticated users.
              </p>
            </div>

            <!-- Library information -->
            <div class="row">
              <div class="col-md-6">
                <h3>📖 Our Mission</h3>
                <p>
                  We're dedicated to providing a vast collection of books and digital resources to our community. 
                  Our library serves as a gateway to knowledge, learning, and discovery.
                </p>
                
                <h3>🕒 Operating Hours</h3>
                <ul class="list-unstyled">
                  <li><strong>Monday - Friday:</strong> 8:00 AM - 9:00 PM</li>
                  <li><strong>Saturday:</strong> 9:00 AM - 6:00 PM</li>
                  <li><strong>Sunday:</strong> 10:00 AM - 5:00 PM</li>
                </ul>
              </div>
              
              <div class="col-md-6">
                <h3>📊 Library Statistics</h3>
                <div class="row">
                  <div class="col-6 text-center">
                    <div class="bg-primary text-white p-3 rounded mb-2">
                      <h4 class="mb-1">25,000+</h4>
                      <small>Books</small>
                    </div>
                  </div>
                  <div class="col-6 text-center">
                    <div class="bg-success text-white p-3 rounded mb-2">
                      <h4 class="mb-1">5,000+</h4>
                      <small>Digital Resources</small>
                    </div>
                  </div>
                  <div class="col-6 text-center">
                    <div class="bg-warning text-white p-3 rounded mb-2">
                      <h4 class="mb-1">1,200+</h4>
                      <small>Active Members</small>
                    </div>
                  </div>
                  <div class="col-6 text-center">
                    <div class="bg-info text-white p-3 rounded">
                      <h4 class="mb-1">50+</h4>
                      <small>Events/Month</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Services -->
            <div class="mt-4">
              <h3>🎯 Our Services</h3>
              <div class="row">
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body text-center">
                      <h5 class="card-title">📚 Book Lending</h5>
                      <p class="card-text">Borrow physical and digital books for up to 3 weeks.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body text-center">
                      <h5 class="card-title">💻 Computer Access</h5>
                      <p class="card-text">Free computer and internet access for all members.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card h-100">
                    <div class="card-body text-center">
                      <h5 class="card-title">📅 Events & Workshops</h5>
                      <p class="card-text">Join our reading clubs, workshops, and community events.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fallback content (shouldn't be shown due to route guard) -->
        <div v-else class="card">
          <div class="card-body text-center">
            <h1 class="text-muted">🔒 Access Restricted</h1>
            <p class="text-muted">
              This page is only accessible to authenticated users. 
              Please <router-link to="/login">login</router-link> to view this content.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.bg-primary, .bg-success, .bg-warning, .bg-info {
  transition: transform 0.2s;
}

.bg-primary:hover, .bg-success:hover, .bg-warning:hover, .bg-info:hover {
  transform: scale(1.05);
}
</style>
