// firebase.js

// Importaciones necesarias de Firebase (versión modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBhgKH6yO6hezJZ0ww--n7EIMXALvWIHk",
  authDomain: "facturaciones-b09de.firebaseapp.com",
  projectId: "facturaciones-b09de",
  storageBucket: "facturaciones-b09de.firebasestorage.app",
  messagingSenderId: "793707516284",
  appId: "1:793707516284:web:2116b84cad733a504794f9",
  measurementId: "G-JXPLERQMDC"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios que vas a usar
const analytics = getAnalytics(app);
const db = getFirestore(app); // Base de datos (Firestore)

// Exportar para usarlos en otros archivos
export { app, analytics, db };