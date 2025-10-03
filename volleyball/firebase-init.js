// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// 🔧 你的 Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDDfnLll7zId8uzaLgLVmcmTMZK8hrXzk8",
    authDomain: "volleyballjoin.firebaseapp.com",
    projectId: "volleyballjoin",
    storageBucket: "volleyballjoin.firebasestorage.app",
    messagingSenderId: "330690229559",
    appId: "1:330690229559:web:8b00da33d96f1acf8e96b2",
    measurementId: "G-4S5DTSLHS0"
};

// 初始化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 匯出，讓其他檔案可以用
export { auth, db, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, collection, addDoc, getDocs, query, where, orderBy };
