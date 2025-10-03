// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDfnLll7zId8uzaLgLVmcmTMZK8hrXzk8",
  authDomain: "volleyballjoin.firebaseapp.com",
  projectId: "volleyballjoin",
  storageBucket: "volleyballjoin.firebasestorage.app",
  messagingSenderId: "330690229559",
  appId: "1:330690229559:web:8b00da33d96f1acf8e96b2",
  measurementId: "G-4S5DTSLHS0"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化服務
const auth = getAuth(app);
const db = getFirestore(app);

// 匯出要用到的函式
export {
  auth, db,
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
  collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc
};
