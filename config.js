// config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiL88Ht5-wazn6kXuVRfO81WrUYDNVLb0",
  authDomain: "explorex-121eb.firebaseapp.com",
  projectId: "explorex-121eb",
  storageBucket: "explorex-121eb.firebasestorage.app",
  messagingSenderId: "1068746367617",
  appId: "1:1068746367617:web:8d958c53946aac7ff0e380",
  measurementId: "G-QBE3HC4G51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export instances for use in our authentication script
export { auth, db };