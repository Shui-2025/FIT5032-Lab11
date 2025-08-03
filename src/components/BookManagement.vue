<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">📚 Book Management - CRUD Operations</h2>
      </div>
      <div class="card-body">
        <!-- Add New Book Section -->
        <div class="row mb-4">
          <div class="col-md-6">
            <h4>Add New Book</h4>
            <form @submit.prevent="addBook">
              <div class="mb-3">
                <label for="newBookName" class="form-label">Book Name:</label>
                <input 
                  type="text" 
                  v-model="newBook.name" 
                  id="newBookName" 
                  class="form-control"
                  placeholder="Enter book name"
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="newBookIsbn" class="form-label">ISBN:</label>
                <input 
                  type="number" 
                  v-model="newBook.isbn" 
                  id="newBookIsbn" 
                  class="form-control"
                  placeholder="Enter book ISBN"
                  required 
                />
              </div>
              <button type="submit" class="btn btn-success" :disabled="adding">
                <span v-if="adding" class="spinner-border spinner-border-sm me-2"></span>
                ➕ Add Book
              </button>
            </form>
          </div>
        </div>

        <!-- Books List Section -->
        <hr>
        <h4>All Books (Update & Delete Operations)</h4>
        
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading books...</p>
        </div>

        <div v-else-if="books.length > 0" class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Book Name</th>
                <th>ISBN</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book.id">
                <td>{{ book.id.substring(0, 8) }}...</td>
                <td>
                  <span v-if="editingId !== book.id">{{ book.name }}</span>
                  <input 
                    v-else 
                    v-model="editForm.name" 
                    class="form-control" 
                    type="text"
                  />
                </td>
                <td>
                  <span v-if="editingId !== book.id">{{ book.isbn }}</span>
                  <input 
                    v-else 
                    v-model="editForm.isbn" 
                    class="form-control" 
                    type="number"
                  />
                </td>
                <td>
                  <small class="text-muted">
                    {{ book.createdAt ? formatDate(book.createdAt) : 'N/A' }}
                  </small>
                </td>
                <td>
                  <div v-if="editingId !== book.id" class="btn-group btn-group-sm">
                    <button 
                      @click="startEdit(book)" 
                      class="btn btn-outline-warning"
                      title="Edit Book"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      @click="deleteBook(book.id)" 
                      class="btn btn-outline-danger"
                      :disabled="deleting === book.id"
                      title="Delete Book"
                    >
                      <span v-if="deleting === book.id" class="spinner-border spinner-border-sm"></span>
                      <span v-else>🗑️ Delete</span>
                    </button>
                  </div>
                  <div v-else class="btn-group btn-group-sm">
                    <button 
                      @click="saveEdit(book.id)" 
                      class="btn btn-success"
                      :disabled="updating"
                      title="Save Changes"
                    >
                      <span v-if="updating" class="spinner-border spinner-border-sm"></span>
                      <span v-else>💾 Save</span>
                    </button>
                    <button 
                      @click="cancelEdit()" 
                      class="btn btn-secondary"
                      title="Cancel Edit"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="text-center text-muted">
          <p>📝 No books found in the database.</p>
          <p class="small">Add some books using the form above to get started.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../Firebase/init.js'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore'

// Reactive data
const books = ref([])
const loading = ref(true)
const adding = ref(false)
const editingId = ref(null)
const editForm = ref({ name: '', isbn: '' })
const updating = ref(false)
const deleting = ref(null)
const newBook = ref({ name: '', isbn: '' })

// Fetch all books
const fetchBooks = async () => {
  try {
    loading.value = true
    const q = query(collection(db, 'books'), orderBy('name'))
    const querySnapshot = await getDocs(q)
    const booksArray = []
    querySnapshot.forEach((doc) => {
      booksArray.push({ id: doc.id, ...doc.data() })
    })
    books.value = booksArray
    console.log('📚 Fetched', booksArray.length, 'books')
  } catch (error) {
    console.error('❌ Error fetching books: ', error)
    alert('Error fetching books. Please try again.')
  } finally {
    loading.value = false
  }
}

// Add new book
const addBook = async () => {
  try {
    adding.value = true
    const isbnNumber = Number(newBook.value.isbn)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }
    
    const docRef = await addDoc(collection(db, 'books'), {
      name: newBook.value.name,
      isbn: isbnNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // Add to local array
    books.value.push({
      id: docRef.id,
      name: newBook.value.name,
      isbn: isbnNumber,
      createdAt: new Date()
    })
    
    // Clear form
    newBook.value = { name: '', isbn: '' }
    alert('✅ Book added successfully!')
    console.log('✅ Book added with ID: ', docRef.id)
  } catch (error) {
    console.error('❌ Error adding book: ', error)
    alert('Error adding book. Please try again.')
  } finally {
    adding.value = false
  }
}

// Start editing
const startEdit = (book) => {
  editingId.value = book.id
  editForm.value = { name: book.name, isbn: book.isbn }
}

// Cancel editing
const cancelEdit = () => {
  editingId.value = null
  editForm.value = { name: '', isbn: '' }
}

// Save edit
const saveEdit = async (bookId) => {
  try {
    updating.value = true
    const isbnNumber = Number(editForm.value.isbn)
    if (isNaN(isbnNumber)) {
      alert('ISBN must be a valid number')
      return
    }
    
    const bookRef = doc(db, 'books', bookId)
    await updateDoc(bookRef, {
      name: editForm.value.name,
      isbn: isbnNumber,
      updatedAt: new Date()
    })
    
    // Update local data
    const bookIndex = books.value.findIndex(book => book.id === bookId)
    if (bookIndex !== -1) {
      books.value[bookIndex].name = editForm.value.name
      books.value[bookIndex].isbn = isbnNumber
    }
    
    cancelEdit()
    alert('✅ Book updated successfully!')
    console.log('✅ Book updated successfully!')
  } catch (error) {
    console.error('❌ Error updating book: ', error)
    alert('Error updating book. Please try again.')
  } finally {
    updating.value = false
  }
}

// Delete book
const deleteBook = async (bookId) => {
  if (!confirm('🗑️ Are you sure you want to delete this book? This action cannot be undone.')) {
    return
  }
  
  try {
    deleting.value = bookId
    await deleteDoc(doc(db, 'books', bookId))
    
    // Remove from local data
    books.value = books.value.filter(book => book.id !== bookId)
    
    alert('✅ Book deleted successfully!')
    console.log('✅ Book deleted successfully!')
  } catch (error) {
    console.error('❌ Error deleting book: ', error)
    alert('Error deleting book. Please try again.')
  } finally {
    deleting.value = null
  }
}

// Format date
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString()
  }
  return new Date(timestamp).toLocaleDateString()
}

// Initialize
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.table th {
  background-color: #343a40;
  color: white;
}

.btn-group-sm .btn {
  font-size: 0.875rem;
}

.card-header {
  background: linear-gradient(135deg, #007bff, #0056b3);
}
</style>
