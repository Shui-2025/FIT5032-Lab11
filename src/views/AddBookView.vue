<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-header">
            <h1 class="text-center mb-0">📚 Add Book</h1>
          </div>
          <div class="card-body">
            <!-- Add Book Form -->
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="isbn" class="form-label">ISBN:</label>
                <input 
                  type="number" 
                  v-model="isbn" 
                  id="isbn" 
                  class="form-control"
                  placeholder="Enter book ISBN"
                  required 
                />
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Name:</label>
                <input 
                  type="text" 
                  v-model="name" 
                  id="name" 
                  class="form-control"
                  placeholder="Enter book name"
                  required 
                />
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg">
                  Add Book
                </button>
              </div>
            </form>

            <!-- Navigation Links -->
            <div class="text-center mt-4">
              <router-link to="/" class="text-decoration-none">
                ← Back to Home
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- BookList Component Section -->
    <div class="row mt-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-info text-white">
            <h2 class="text-center mb-0">📖 Book Collection</h2>
          </div>
          <div class="card-body">
            <BookList :key="bookListKey" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../Firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'
import BookList from '../components/BookList.vue'

// Reference of isbn and name
const isbn = ref('')
const name = ref('')
const bookListKey = ref(0) // Used to force BookList component re-render

// async task to add isbn and name
const addBook = async () => {
  try {
    // Convert ISBN to number for validation
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }
    
    // Add data to "books" collection
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })
    
    // Clear form after successful addition
    isbn.value = ''
    name.value = ''
    alert('Book added successfully!')
    
    // Force BookList component to refresh by changing key
    bookListKey.value++
    
  } catch (error) {
    console.error('Error adding book: ', error)
    alert('Error adding book. Please try again.')
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-radius: 0.375rem 0.375rem 0 0;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.alert {
  border-left: 4px solid;
}

.alert-success {
  border-left-color: #28a745;
}

.alert-danger {
  border-left-color: #dc3545;
}
</style>
