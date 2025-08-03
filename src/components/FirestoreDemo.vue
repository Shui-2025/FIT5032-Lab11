<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">🔥 Firestore Database Demo</h3>
          </div>
          <div class="card-body">
            
            <!-- Library Statistics -->
            <div class="row mb-4">
              <div class="col-md-6">
                <h5>📊 Library Statistics</h5>
                <button @click="loadLibraryStats" class="btn btn-primary mb-3" :disabled="loading">
                  {{ loading ? 'Loading...' : 'Load Stats' }}
                </button>
                
                <div v-if="libraryStats" class="alert alert-info">
                  <strong>Library Overview:</strong><br>
                  📚 Total Books: {{ libraryStats.totalBooks }}<br>
                  👥 Total Users: {{ libraryStats.totalUsers }}<br>
                  ✅ Available Books: {{ libraryStats.availableBooks }}<br>
                  📖 Borrowed Books: {{ libraryStats.borrowedBooks }}<br>
                  📈 Utilization Rate: {{ libraryStats.utilizationRate }}%
                </div>
              </div>
              
              <div class="col-md-6">
                <h5>📖 Add New Book</h5>
                <form @submit.prevent="addNewBook">
                  <div class="mb-2">
                    <input 
                      v-model="newBook.title" 
                      type="text" 
                      class="form-control form-control-sm" 
                      placeholder="Book Title" 
                      required
                    >
                  </div>
                  <div class="mb-2">
                    <input 
                      v-model="newBook.author" 
                      type="text" 
                      class="form-control form-control-sm" 
                      placeholder="Author" 
                      required
                    >
                  </div>
                  <div class="mb-2">
                    <input 
                      v-model="newBook.isbn" 
                      type="text" 
                      class="form-control form-control-sm" 
                      placeholder="ISBN" 
                      required
                    >
                  </div>
                  <button type="submit" class="btn btn-success btn-sm" :disabled="loading">
                    Add Book
                  </button>
                </form>
              </div>
            </div>

            <!-- Available Books -->
            <div class="row mb-4">
              <div class="col-md-12">
                <h5>📚 Available Books</h5>
                <button @click="loadAvailableBooks" class="btn btn-secondary mb-3" :disabled="loading">
                  {{ loading ? 'Loading...' : 'Load Books' }}
                </button>
                
                <div v-if="availableBooks.length > 0" class="row">
                  <div v-for="book in availableBooks" :key="book.id" class="col-md-4 mb-2">
                    <div class="card border-success">
                      <div class="card-body p-2">
                        <h6 class="card-title mb-1">{{ book.title }}</h6>
                        <p class="card-text mb-1">
                          <small class="text-muted">by {{ book.author }}</small><br>
                          <small class="text-muted">ISBN: {{ book.isbn }}</small>
                        </p>
                        <button 
                          @click="borrowBook(book.id)" 
                          class="btn btn-warning btn-sm"
                          :disabled="loading"
                        >
                          Borrow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else-if="!loading" class="alert alert-warning">
                  No books available. Add some books first!
                </div>
              </div>
            </div>

            <!-- Recent Activities -->
            <div class="row">
              <div class="col-md-12">
                <h5>📋 Recent Activities</h5>
                <button @click="loadRecentActivities" class="btn btn-info mb-3" :disabled="loading">
                  {{ loading ? 'Loading...' : 'Load Activities' }}
                </button>
                
                <div v-if="recentActivities.length > 0">
                  <ul class="list-group">
                    <li v-for="activity in recentActivities" :key="activity.id" class="list-group-item">
                      <strong>{{ activity.type }}:</strong> {{ activity.description }}
                      <br><small class="text-muted">{{ formatDate(activity.timestamp) }}</small>
                    </li>
                  </ul>
                </div>
                
                <div v-else-if="!loading" class="alert alert-info">
                  No recent activities found.
                </div>
              </div>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="alert alert-danger mt-3">
              <strong>Error:</strong> {{ error }}
            </div>
            
            <!-- Success Messages -->
            <div v-if="successMessage" class="alert alert-success mt-3">
              <strong>Success:</strong> {{ successMessage }}
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { libraryOperations, analyticsOperations } from '../Firebase/firestore.js'

// Reactive data
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const libraryStats = ref(null)
const availableBooks = ref([])
const recentActivities = ref([])

// New book form
const newBook = ref({
  title: '',
  author: '',
  isbn: ''
})

// Get current user from auth
const auth = inject('auth')

// Methods
const clearMessages = () => {
  error.value = ''
  successMessage.value = ''
}

const loadLibraryStats = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const result = await analyticsOperations.getLibraryStats()
    if (result.success) {
      libraryStats.value = result.data
      successMessage.value = 'Library statistics loaded successfully!'
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to load library statistics'
    console.error('Error loading stats:', err)
  } finally {
    loading.value = false
  }
}

const loadAvailableBooks = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const result = await libraryOperations.getAvailableBooks()
    if (result.success) {
      availableBooks.value = result.data
      successMessage.value = `Found ${result.data.length} available books!`
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to load available books'
    console.error('Error loading books:', err)
  } finally {
    loading.value = false
  }
}

const addNewBook = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const result = await libraryOperations.addBook(newBook.value)
    if (result.success) {
      successMessage.value = 'Book added successfully!'
      
      // Log the activity
      await analyticsOperations.logActivity({
        type: 'Book Added',
        description: `"${newBook.value.title}" by ${newBook.value.author} was added to the library`,
        userId: auth.currentUser.value?.email || 'system',
        bookId: result.id
      })
      
      // Clear the form
      newBook.value = { title: '', author: '', isbn: '' }
      
      // Reload books if they were loaded
      if (availableBooks.value.length > 0) {
        await loadAvailableBooks()
      }
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to add book'
    console.error('Error adding book:', err)
  } finally {
    loading.value = false
  }
}

const borrowBook = async (bookId) => {
  if (!auth.currentUser.value) {
    error.value = 'Please login to borrow books'
    return
  }
  
  loading.value = true
  clearMessages()
  
  try {
    const result = await libraryOperations.borrowBook(bookId, auth.currentUser.value.email)
    if (result.success) {
      successMessage.value = 'Book borrowed successfully!'
      
      // Log the activity
      const borrowedBook = availableBooks.value.find(book => book.id === bookId)
      await analyticsOperations.logActivity({
        type: 'Book Borrowed',
        description: `"${borrowedBook?.title}" was borrowed by ${auth.currentUser.value.name}`,
        userId: auth.currentUser.value.email,
        bookId: bookId
      })
      
      // Reload books
      await loadAvailableBooks()
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to borrow book'
    console.error('Error borrowing book:', err)
  } finally {
    loading.value = false
  }
}

const loadRecentActivities = async () => {
  loading.value = true
  clearMessages()
  
  try {
    const result = await analyticsOperations.getRecentActivities()
    if (result.success) {
      recentActivities.value = result.data
      successMessage.value = `Loaded ${result.data.length} recent activities!`
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to load recent activities'
    console.error('Error loading activities:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}

// Auto-load data on component mount
onMounted(() => {
  if (auth.currentUser.value) {
    loadLibraryStats()
  }
})
</script>

<style scoped>
.card-header {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
}

.card.border-success {
  border-width: 2px;
}

.btn:disabled {
  opacity: 0.6;
}
</style>
