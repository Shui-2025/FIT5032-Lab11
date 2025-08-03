<template>
  <div>
    <h1>Books with ISBN > 1000</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading books...</p>
    </div>
    <div v-else-if="books.length > 0">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Book Name</th>
              <th>ISBN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
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
                <div v-if="editingId !== book.id" class="btn-group btn-group-sm">
                  <button 
                    @click="startEdit(book)" 
                    class="btn btn-outline-primary btn-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    @click="deleteBook(book.id)" 
                    class="btn btn-outline-danger btn-sm"
                    :disabled="deleting === book.id"
                  >
                    <span v-if="deleting === book.id" class="spinner-border spinner-border-sm"></span>
                    <span v-else>🗑️ Delete</span>
                  </button>
                </div>
                <div v-else class="btn-group btn-group-sm">
                  <button 
                    @click="saveEdit(book.id)" 
                    class="btn btn-success btn-sm"
                    :disabled="updating"
                  >
                    <span v-if="updating" class="spinner-border spinner-border-sm"></span>
                    <span v-else>💾 Save</span>
                  </button>
                  <button 
                    @click="cancelEdit()" 
                    class="btn btn-secondary btn-sm"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-center text-muted">
      <p>No books found with ISBN > 1000.</p>
      <p class="small">Try adding some books with ISBN greater than 1000 using the form above.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../Firebase/init.js';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  setup() {
    const books = ref([]);
    const loading = ref(true);
    const editingId = ref(null);
    const editForm = ref({ name: '', isbn: '' });
    const updating = ref(false);
    const deleting = ref(null);

    const fetchBooks = async () => {
      try {
        loading.value = true;
        const q = query(collection(db, 'books'), where('isbn', '>', 1000));
        const querySnapshot = await getDocs(q);
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        books.value = booksArray;
      } catch (error) {
        console.error('Error fetching books: ', error);
      } finally {
        loading.value = false;
      }
    };

    const startEdit = (book) => {
      editingId.value = book.id;
      editForm.value = { name: book.name, isbn: book.isbn };
    };

    const cancelEdit = () => {
      editingId.value = null;
      editForm.value = { name: '', isbn: '' };
    };

    const saveEdit = async (bookId) => {
      try {
        updating.value = true;
        const bookRef = doc(db, 'books', bookId);
        await updateDoc(bookRef, {
          name: editForm.value.name,
          isbn: Number(editForm.value.isbn),
          updatedAt: new Date()
        });
        
        // Update local data
        const bookIndex = books.value.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
          books.value[bookIndex].name = editForm.value.name;
          books.value[bookIndex].isbn = Number(editForm.value.isbn);
        }
        
        cancelEdit();
        alert('Book updated successfully!');
        console.log('✅ Book updated successfully!');
      } catch (error) {
        console.error('❌ Error updating book: ', error);
        alert('Error updating book. Please try again.');
      } finally {
        updating.value = false;
      }
    };

    const deleteBook = async (bookId) => {
      if (!confirm('Are you sure you want to delete this book?')) {
        return;
      }
      
      try {
        deleting.value = bookId;
        await deleteDoc(doc(db, 'books', bookId));
        
        // Remove from local data
        books.value = books.value.filter(book => book.id !== bookId);
        
        alert('Book deleted successfully!');
        console.log('✅ Book deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting book: ', error);
        alert('Error deleting book. Please try again.');
      } finally {
        deleting.value = null;
      }
    };

    onMounted(() => {
      fetchBooks();
    });

    return {
      books,
      loading,
      editingId,
      editForm,
      updating,
      deleting,
      startEdit,
      cancelEdit,
      saveEdit,
      deleteBook
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
}

ul {
  list-style-type: disc;
  padding-left: 2rem;
  margin: 1rem 0;
}

li {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #555;
}
</style>
