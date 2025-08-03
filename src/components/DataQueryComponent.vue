<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">🔍 Firestore Query Dashboard</h3>
            <small class="text-muted">Demonstrate advanced Firestore querying capabilities</small>
          </div>
          <div class="card-body">
            
            <!-- Query Controls -->
            <div class="row mb-4">
              <div class="col-md-12">
                <h5>📊 Query Options</h5>
                <div class="row">
                  <!-- Collection Selector -->
                  <div class="col-md-3">
                    <label class="form-label">Collection:</label>
                    <select v-model="selectedCollection" class="form-select form-select-sm">
                      <option value="books">📚 Books</option>
                      <option value="userProfiles">👥 User Profiles</option>
                      <option value="activities">📋 Activities</option>
                    </select>
                  </div>
                  
                  <!-- Filter Type -->
                  <div class="col-md-3">
                    <label class="form-label">Filter Type:</label>
                    <select v-model="filterType" class="form-select form-select-sm">
                      <option value="all">All Records</option>
                      <option value="available">Available Books</option>
                      <option value="borrowed">Borrowed Books</option>
                      <option value="recent">Recent (Last 7 days)</option>
                      <option value="custom">Custom Query</option>
                    </select>
                  </div>
                  
                  <!-- Sort Options -->
                  <div class="col-md-3">
                    <label class="form-label">Sort By:</label>
                    <select v-model="sortField" class="form-select form-select-sm">
                      <option value="createdAt">📅 Created Date</option>
                      <option value="name">📝 Name</option>
                      <option value="isbn">🔢 ISBN</option>
                      <option value="available">✅ Availability</option>
                    </select>
                  </div>
                  
                  <!-- Sort Direction -->
                  <div class="col-md-2">
                    <label class="form-label">Sort Order:</label>
                    <select v-model="sortDirection" class="form-select form-select-sm">
                      <option value="desc">📉 Descending</option>
                      <option value="asc">📈 Ascending</option>
                    </select>
                  </div>

                  <!-- Limit -->
                  <div class="col-md-1">
                    <label class="form-label">Limit:</label>
                    <input v-model.number="queryLimit" type="number" class="form-control form-control-sm" min="1" max="100">
                  </div>
                </div>
                
                <!-- Custom Query Fields -->
                <div v-if="filterType === 'custom'" class="row mt-3">
                  <div class="col-md-4">
                    <label class="form-label">Field:</label>
                    <input v-model="customField" type="text" class="form-control form-control-sm" placeholder="e.g., available">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Operator:</label>
                    <select v-model="customOperator" class="form-select form-select-sm">
                      <option value="==">==(equals)</option>
                      <option value="!=">=!=(not equals)</option>
                      <option value=">">&gt; (greater than)</option>
                      <option value=">=">&gt;= (greater or equal)</option>
                      <option value="<">&lt; (less than)</option>
                      <option value="<=">&lt;= (less or equal)</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Value:</label>
                    <input v-model="customValue" type="text" class="form-control form-control-sm" placeholder="Search value">
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="row mt-3">
                  <div class="col-md-12">
                    <button @click="executeQuery" class="btn btn-primary btn-sm me-2" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      🔍 Execute Query
                    </button>
                    <button @click="clearResults" class="btn btn-secondary btn-sm me-2">
                      🗑️ Clear Results
                    </button>
                    <span class="badge bg-info ms-2">{{ queryResults.length }} records found</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Query Results Display -->
            <div class="row">
              <div class="col-md-12">
                <h5>📋 Query Results</h5>
                
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Executing query...</p>
                </div>
                
                <!-- Error State -->
                <div v-else-if="error" class="alert alert-danger">
                  <strong>❌ Query Error:</strong> {{ error }}
                </div>
                
                <!-- Results Table -->
                <div v-else-if="queryResults.length > 0" class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="table-dark">
                      <tr>
                        <th>ID</th>
                        <th v-for="column in tableColumns" :key="column">{{ formatColumnName(column) }}</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in queryResults" :key="item.id">
                        <td><code>{{ item.id }}</code></td>
                        <td v-for="column in tableColumns" :key="column">
                          {{ formatFieldValue(item[column]) }}
                        </td>
                        <td>
                          <button @click="viewDetails(item)" class="btn btn-outline-info btn-sm">
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- No Results -->
                <div v-else class="alert alert-info">
                  <strong>ℹ️ No Results:</strong> No records match your query criteria. Try adjusting your filters.
                </div>
              </div>
            </div>

            <!-- Query Statistics -->
            <div v-if="queryResults.length > 0" class="row mt-4">
              <div class="col-md-12">
                <div class="card bg-light">
                  <div class="card-body">
                    <h6>📊 Query Statistics</h6>
                    <div class="row">
                      <div class="col-md-3">
                        <strong>Total Records:</strong> {{ queryResults.length }}
                      </div>
                      <div class="col-md-3">
                        <strong>Collection:</strong> {{ selectedCollection }}
                      </div>
                      <div class="col-md-3">
                        <strong>Filter:</strong> {{ filterType }}
                      </div>
                      <div class="col-md-3">
                        <strong>Sort:</strong> {{ sortField }} ({{ sortDirection }})
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

    <!-- Detail Modal -->
    <div v-if="selectedItem" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🔍 Item Details</h5>
            <button type="button" class="btn-close" @click="closeDetails"></button>
          </div>
          <div class="modal-body">
            <pre class="bg-light p-3 rounded">{{ JSON.stringify(selectedItem, null, 2) }}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetails">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from '../Firebase/init.js'

// Query Parameters
const selectedCollection = ref('books')
const filterType = ref('all')
const sortField = ref('createdAt')
const sortDirection = ref('desc')
const queryLimit = ref(10) // Added for limit

// Custom Query Parameters
const customField = ref('')
const customOperator = ref('==')
const customValue = ref('')

// Results and UI State
const queryResults = ref([])
const loading = ref(false)
const error = ref('')
const selectedItem = ref(null)

// Computed Properties
const tableColumns = computed(() => {
  if (queryResults.value.length === 0) return []
  
  const firstItem = queryResults.value[0]
  return Object.keys(firstItem).filter(key => 
    key !== 'id' && 
    typeof firstItem[key] !== 'object'
  ).slice(0, 6) // Limit to 6 columns for display
})

// Methods
const executeQuery = async () => {
  loading.value = true
  error.value = ''
  
  try {
    let q = collection(db, selectedCollection.value)
    
    // Apply filters based on filter type
    switch (filterType.value) {
      case 'available':
        q = query(q, where('available', '==', true))
        break
      case 'borrowed':
        q = query(q, where('available', '==', false))
        break
      case 'recent': {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        q = query(q, where('createdAt', '>=', sevenDaysAgo))
        break
      }
      case 'custom':
        if (customField.value && customValue.value) {
          let value = customValue.value
          // Try to convert to appropriate type
          if (value === 'true') value = true
          else if (value === 'false') value = false
          else if (!isNaN(value)) value = Number(value)
          
          q = query(q, where(customField.value, customOperator.value, value))
        }
        break
    }
    
    // Apply sorting
    if (sortField.value) {
      q = query(q, orderBy(sortField.value, sortDirection.value))
    }
    
    // Add limit to prevent large data pulls
    if (queryLimit.value > 0) {
      q = query(q, limit(queryLimit.value))
    }
    
    const querySnapshot = await getDocs(q)
    const results = []
    
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    queryResults.value = results
    console.log(`🔍 Query executed: Found ${results.length} results`)
    
  } catch (err) {
    console.error('❌ Query error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const clearResults = () => {
  queryResults.value = []
  error.value = ''
  selectedItem.value = null
}

const viewDetails = (item) => {
  selectedItem.value = item
}

const closeDetails = () => {
  selectedItem.value = null
}

const formatColumnName = (column) => {
  return column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1')
}

const formatFieldValue = (value) => {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'boolean') return value ? '✅' : '❌'
  if (value instanceof Timestamp) return value.toDate().toLocaleDateString()
  if (value instanceof Date) return value.toLocaleDateString()
  if (typeof value === 'string' && value.length > 50) return value.substring(0, 50) + '...'
  return value
}

// Auto-execute initial query
executeQuery()
</script>

<style scoped>
.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table th {
  font-size: 0.9rem;
  font-weight: 600;
}

.table td {
  font-size: 0.85rem;
  vertical-align: middle;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.modal {
  display: block !important;
}

pre {
  font-size: 0.8rem;
  max-height: 400px;
  overflow-y: auto;
}

.badge {
  font-size: 0.75rem;
}

.btn-sm {
  font-size: 0.8rem;
}

.form-select-sm, .form-control-sm {
  font-size: 0.85rem;
}
</style>
