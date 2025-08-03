<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">📚 Count Book API</h3>
            <small class="text-muted">JSON API response for authors and books data</small>
          </div>
          <div class="card-body">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading authors data...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger">
              <strong>❌ Error:</strong> {{ error }}
            </div>
            
            <!-- API Response Display -->
            <div v-else-if="apiResponse" class="api-response">
              <h5>📋 API Response:</h5>
              <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getApiData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/src/assets/json/authors.json')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    authors.value = data
    
    calculateStats()
    
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  }

  apiResponse.value = {
    success: true,
    data: {
      authorsCount: authorsCount.value,
      totalBooks: totalBooks.value,
      authors: authors.value.map(author => ({
        name: author.name,
        bookCount: author.famousWorks.length,
      }))
    },
    timestamp: new Date().toISOString()
  }
}

onMounted(() => {
  getApiData()
})

defineExpose({
  getApiData
})
</script>

<style scoped>
.card-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.api-response {
  margin-top: 20px;
}

.api-response pre {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  color: #495057;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert {
  border-radius: 0.375rem;
}

@media (max-width: 768px) {
  .api-response pre {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
}
</style>