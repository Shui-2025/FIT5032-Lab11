// Firestore database operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from './init.js';

// User Profile Operations
export const userProfileOperations = {
  // Create a new user profile
  async createUserProfile(userId, profileData) {
    try {
      const docRef = await addDoc(collection(db, "userProfiles"), {
        userId: userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("User profile created with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding user profile: ", error);
      return { success: false, error: error.message };
    }
  },

  // Get user profile by user ID
  async getUserProfile(userId) {
    try {
      const q = query(collection(db, "userProfiles"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: "User profile not found" };
      }
    } catch (error) {
      console.error("Error getting user profile: ", error);
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  async updateUserProfile(profileId, updateData) {
    try {
      const profileRef = doc(db, "userProfiles", profileId);
      await updateDoc(profileRef, {
        ...updateData,
        updatedAt: new Date()
      });
      console.log("User profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating user profile: ", error);
      return { success: false, error: error.message };
    }
  }
};


export const libraryOperations = {

  async addBook(bookData) {
    try {
      const docRef = await addDoc(collection(db, "books"), {
        ...bookData,
        createdAt: new Date(),
        available: true,
        borrowedBy: null,
        borrowedAt: null
      });
      console.log("Book added with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding book: ", error);
      return { success: false, error: error.message };
    }
  },


  async getAvailableBooks() {
    try {
      const q = query(
        collection(db, "books"), 
        where("available", "==", true),
        orderBy("name")
      );
      const querySnapshot = await getDocs(q);
      const books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: books };
    } catch (error) {
      console.error("Error getting books: ", error);
      return { success: false, error: error.message };
    }
  },


  async borrowBook(bookId, userId) {
    try {
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        available: false,
        borrowedBy: userId,
        borrowedAt: new Date()
      });
      console.log("Book borrowed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error borrowing book: ", error);
      return { success: false, error: error.message };
    }
  },

  // Return a book
  async returnBook(bookId) {
    try {
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        available: true,
        borrowedBy: null,
        borrowedAt: null,
        returnedAt: new Date()
      });
      console.log("Book returned successfully");
      return { success: true };
    } catch (error) {
      console.error("Error returning book: ", error);
      return { success: false, error: error.message };
    }
  }
};

// Analytics and Reporting
export const analyticsOperations = {
  // Get library statistics
  async getLibraryStats() {
    try {
      const booksSnapshot = await getDocs(collection(db, "books"));
      const usersSnapshot = await getDocs(collection(db, "userProfiles"));
      
      const totalBooks = booksSnapshot.size;
      const totalUsers = usersSnapshot.size;
      
      let availableBooks = 0;
      let borrowedBooks = 0;
      
      booksSnapshot.forEach((doc) => {
        const bookData = doc.data();
        if (bookData.available) {
          availableBooks++;
        } else {
          borrowedBooks++;
        }
      });

      return {
        success: true,
        data: {
          totalBooks,
          totalUsers,
          availableBooks,
          borrowedBooks,
          utilizationRate: totalBooks > 0 ? (borrowedBooks / totalBooks * 100).toFixed(2) : 0
        }
      };
    } catch (error) {
      console.error("Error getting library stats: ", error);
      return { success: false, error: error.message };
    }
  },

  // Get recent activities (last 10)
  async getRecentActivities() {
    try {
      const q = query(
        collection(db, "activities"),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data: activities };
    } catch (error) {
      console.error("Error getting recent activities: ", error);
      return { success: false, error: error.message };
    }
  },

  // Log an activity
  async logActivity(activityData) {
    try {
      const docRef = await addDoc(collection(db, "activities"), {
        ...activityData,
        timestamp: new Date()
      });
      console.log("Activity logged with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error logging activity: ", error);
      return { success: false, error: error.message };
    }
  }
};

// Export all operations
export default {
  userProfileOperations,
  libraryOperations,
  analyticsOperations
};
