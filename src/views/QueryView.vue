<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 class="mb-1">🔍 Firestore Query Explorer</h2>
            <p class="text-muted mb-0">Advanced querying capabilities for your Firestore database</p>
          </div>
          <router-link to="/" class="btn btn-outline-secondary">
            ← Back to Home
          </router-link>
        </div>
        
        <!-- Main Query Component -->
        <DataQueryComponent />
        
        <!-- Query Documentation -->
        <div class="row mt-5">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header bg-info text-white">
                <h5 class="mb-0">📖 Query Documentation</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <h6>🎯 Available Query Types:</h6>
                    <ul class="list-unstyled">
                      <li><strong>All Records:</strong> Fetch all documents from selected collection</li>
                      <li><strong>Available Books:</strong> Books with available=true</li>
                      <li><strong>Borrowed Books:</strong> Books with available=false</li>
                      <li><strong>Recent:</strong> Documents created in last 7 days</li>
                      <li><strong>Custom:</strong> Define your own where conditions</li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <h6>🔧 Supported Operations:</h6>
                    <ul class="list-unstyled">
                      <li><code>==</code> Equal to</li>
                      <li><code>!=</code> Not equal to</li>
                      <li><code>&gt;</code> Greater than</li>
                      <li><code>&gt;=</code> Greater than or equal</li>
                      <li><code>&lt;</code> Less than</li>
                      <li><code>&lt;=</code> Less than or equal</li>
                    </ul>
                  </div>
                </div>
                
                <div class="row mt-3">
                  <div class="col-md-12">
                    <h6>💡 Query Examples:</h6>
                    <div class="bg-light p-3 rounded">
                      <p class="mb-2"><strong>Find available books:</strong></p>
                      <code>Field: available, Operator: ==, Value: true</code>
                      
                      <p class="mb-2 mt-3"><strong>Find books by ISBN range:</strong></p>
                      <code>Field: isbn, Operator: &gt;, Value: 9780000000000</code>
                      
                      <p class="mb-2 mt-3"><strong>Find recent activities:</strong></p>
                      <code>Use "Recent" filter type for last 7 days</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DataQueryComponent from '../components/DataQueryComponent.vue'
</script>

<style scoped>
.container-fluid {
  max-width: 1400px;
}

.card-header.bg-info {
  background: linear-gradient(135deg, #17a2b8, #138496) !important;
}

code {
  background-color: #f8f9fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}

.bg-light {
  border: 1px solid #dee2e6;
}

h2 {
  color: #495057;
}

.text-muted {
  font-size: 1.1rem;
}
</style>
