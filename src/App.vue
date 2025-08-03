<script setup>
import { ref, provide, onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { auth } from './Firebase/init.js'
import BHeader from './components/BHeader.vue'

const isAuthenticated = ref(false)
const currentUser = ref(null)


const USER_ROLES = {
  'admin@library.com': {
    password: 'library123',
    role: 'Administrator',
    permissions: ['all'],
    name: 'Library Administrator'
  },
  'librarian@library.com': {
    password: 'librarian123',
    role: 'Librarian',
    permissions: ['books', 'users', 'reports'],
    name: 'Senior Librarian'
  },
  'staff@library.com': {
    password: 'staff123',
    role: 'Staff',
    permissions: ['books', 'basic'],
    name: 'Library Staff'
  },
  'user@library.com': {
    password: 'user123',
    role: 'Member',
    permissions: ['browse', 'borrow'],
    name: 'Library Member'
  }
}

// Firebase 用户角色映射
const FIREBASE_ROLES = {
  'admin@firebase.com': { role: 'Administrator', permissions: ['all'] },
  'librarian@firebase.com': { role: 'Librarian', permissions: ['books', 'users'] },
  'member@firebase.com': { role: 'Member', permissions: ['browse', 'borrow'] }
}

onMounted(() => {
  // 检查localStorage中的认证状态
  const authData = localStorage.getItem('library_auth')
  const userData = localStorage.getItem('library_user')
  
  if (authData === 'true' && userData) {
    try {
      isAuthenticated.value = true
      currentUser.value = JSON.parse(userData)
    } catch {
      localStorage.removeItem('library_auth')
      localStorage.removeItem('library_user')
    }
  }
  
  // 监听Firebase认证状态变化
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 用户已登录Firebase，检查角色
      console.log("🔥 Firebase user detected:", user.email)
      
      const firebaseRole = FIREBASE_ROLES[user.email] || { 
        role: 'Member', 
        permissions: ['browse'] 
      }
      
      const userData = {
        email: user.email,
        name: user.displayName || `Firebase ${firebaseRole.role}`,
        uid: user.uid,
        role: firebaseRole.role,
        permissions: firebaseRole.permissions,
        provider: 'firebase'
      }
      
      isAuthenticated.value = true
      currentUser.value = userData
      
      localStorage.setItem('library_auth', 'true')
      localStorage.setItem('library_user', JSON.stringify(userData))
      
      console.log(`✅ Firebase ${firebaseRole.role} authenticated:`, userData)
    } else {
      // 用户已登出Firebase，但不自动登出应用（保持现有逻辑）
      console.log("❌ No Firebase user detected")
    }
  })
})

const login = (email, password) => {
  const userRole = USER_ROLES[email]
  if (userRole && password === userRole.password) {
    const user = {
      email: email,
      name: userRole.name,
      role: userRole.role,
      permissions: userRole.permissions
    }
    
    isAuthenticated.value = true
    currentUser.value = user
    
    localStorage.setItem('library_auth', 'true')
    localStorage.setItem('library_user', JSON.stringify(user))
    
    console.log(`✅ ${userRole.role} login successful:`, user)
    return { success: true, user }
  } else {
    console.log('❌ Login failed for:', email)
    return { 
      success: false, 
      error: 'Invalid credentials. Try: admin@library.com/library123, librarian@library.com/librarian123, staff@library.com/staff123, or user@library.com/user123' 
    }
  }
}

const logout = () => {
  // 同时登出Firebase和应用
  const auth = getAuth()
  auth.signOut().then(() => {
    console.log("Firebase signout successful")
  }).catch((error) => {
    console.log("Firebase signout error:", error)
  })
  
  isAuthenticated.value = false
  currentUser.value = null
  
  localStorage.removeItem('library_auth')
  localStorage.removeItem('library_user')
}

provide('auth', {
  isAuthenticated,
  currentUser,
  login,
  logout
})
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <router-view />
  </main>
</template>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

.form {
  text-align: center;
  margin-top: 50px;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}

#username:focus,
#password:focus,
#isAustralian:focus {
  border-color: #275fda;
  box-shadow: 0 0 0 0.2rem rgba(39, 95, 218, 0.25);
}
</style>
