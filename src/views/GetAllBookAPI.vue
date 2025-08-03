<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">📖 Get All Books API</h3>
            <small class="text-muted">JSON API response showing all books from all authors</small>
          </div>
          <div class="card-body">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">Loading books data...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger">
              <strong>❌ Error:</strong> {{ error }}
            </div>
            
            <!-- API Response Display -->
            <div v-else-if="apiResponse" class="api-response">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5>📋 API Response:</h5>
                <div>
                  <button @click="toggleView" class="btn btn-sm btn-outline-primary me-2">
                    {{ viewMode === 'json' ? '📊 Table View' : '📄 JSON View' }}
                  </button>
                  <button @click="refreshData" class="btn btn-sm btn-outline-success">
                    🔄 Refresh
                  </button>
                </div>
              </div>
              
              <!-- JSON View -->
              <div v-if="viewMode === 'json'">
                <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
              </div>
              
              <!-- Table View -->
              <div v-else class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Year</th>
                      <th>Author</th>
                      <th>Genres</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="book in apiResponse.data.books" :key="book.id">
                      <td>{{ book.id }}</td>
                      <td>
                        <strong>{{ book.title }}</strong>
                      </td>
                      <td>
                        <span class="badge bg-secondary">{{ book.year }}</span>
                      </td>
                      <td>{{ book.author }}</td>
                      <td>
                        <span 
                          v-for="genre in book.genres" 
                          :key="genre"
                          class="badge bg-info me-1"
                        >
                          {{ genre }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
const viewMode = ref('json') // 'json' or 'table'

const totalBooks = ref(0)

const extractAllBooks = () => {
  const allBooks = []
  let bookId = 1
  
  authors.value.forEach(author => {
    author.famousWorks.forEach(book => {
      allBooks.push({
        id: bookId++,
        title: book.title,
        year: book.year,
        author: author.name,
        authorId: author.id,
        genres: author.genres
      })
    })
  })
  
  return allBooks
}

const getAllBooksData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/src/assets/json/authors.json')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    authors.value = data
    
    const allBooks = extractAllBooks()
    totalBooks.value = allBooks.length
    
    // Create API-style response
    apiResponse.value = {
      success: true,
      message: "Successfully retrieved all books",
      data: {
        totalBooks: totalBooks.value,
        books: allBooks
      },
      meta: {
        timestamp: new Date().toISOString(),
        apiVersion: "1.0",
        endpoint: "/api/books"
      }
    }
    
  } catch (err) {
    error.value = `Error loading books data: ${err.message}`
    console.error('Error loading books data:', err)
  } finally {
    loading.value = false
  }
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'json' ? 'table' : 'json'
}

const refreshData = () => {
  getAllBooksData()
}

onMounted(() => {
  getAllBooksData()
})

defineExpose({
  getAllBooksData,
  toggleView,
  refreshData
})
</script>

<style scoped>
.card-header {
  background: linear-gradient(135deg, #6f42c1 0%, #007bff 100%);
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
  max-height: 600px;
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

.table-responsive {
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.table {
  margin-bottom: 0;
}

.badge {
  font-size: 0.75em;
}

.btn {
  border-radius: 0.375rem;
}

@media (max-width: 768px) {
  .api-response pre {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
  
  .table {
    font-size: 0.875rem;
  }
  
  .d-flex {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .d-flex > div {
    margin-top: 0.5rem;
  }
}
</style>
