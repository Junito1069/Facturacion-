# 🔧 FIREBASE DEBUG - Guía Rápida de Verificación

## Estado Actual
Tu aplicación está **funcionando con localStorage** como respaldo mientras se configura Firebase correctamente.

### Consola: Qué significa cada línea
```
✅ Modo de almacenamiento: LOCALSTORAGE TEMPORARIO
   → Significa que Firestore no está conectado, usando localStorage
   
✅ Respaldo guardado en localStorage
   → Los datos se guardan en la computadora (temporal)
   
✅ Tabla de estudiantes renderizada
   → Los estudiantes se muestran correctamente en la tabla
```

---

## ✅ PASO 1: Verificar que TODO funciona ahora

1. **Abre** `index.html` en el navegador
2. **Presiona** F12 (para abrir la consola)
3. **Haz clic** en "Nuevo estudiante"
4. **Rellena** el formulario (nombre, curso, tutor, teléfono)
5. **Haz clic** en "Guardar"
6. **Verifica**:
   - Deberías ver en consola: `Respaldo guardado en localStorage`
   - El estudiante debe aparecer en la tabla
   - Si refrescas (F5), el estudiante sigue ahí

---

## 🔧 PASO 2: Configurar Firestore (IMPORTANTE)

**Si quieres que los datos se guarden en FIRESTORE (no solo en la computadora):**

### 2a. Ir a Firebase Console
1. Abre: https://console.firebase.google.com/
2. Selecciona el proyecto: **"facturaciones-b09de"**
3. Click izquierdo en **"Firestore Database"**

### 2b. Verifica que existe la base de datos
- Si NO ves colecciones (students, invoices, etc.)
- Click en **"Create Database"**
- Selecciona: **Production mode**
- Ubicación: **us-central1** (o la más cercana)
- Click **"Create"**

### 2c. CAMBIAR LAS REGLAS (CRÍTICO)
1. Click en la pestaña **"Rules"** (Reglas)
2. **REEMPLAZA TODO** con esto:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**
4. **ESPERA 30 SEGUNDOS** a que se aplique

### 2d. Crear las colecciones
1. Click en **"Start collection"**
2. Nombre: `students` → Click **"Next"**
3. Click **"Add document"** (podemos dejarlo vacío por ahora)
4. Repite para: `invoices`, `payments`, `users`

---

## 🧪 PASO 3: Verificar conexión con Firestore

1. **Recarga la página** (F5)
2. **Abre consola** (F12)
3. **Busca esta línea**:
   ```
   db disponible: SÍ
   Modo de almacenamiento: FIRESTORE
   ```
4. **Si la ves**, significa ¡**FIRESTORE ESTÁ CONECTADO!** ✅

---

## 💾 PASO 4: Probar guardar en Firestore

1. **Haz clic** en "Nuevo estudiante"
2. **Rellena** el formulario
3. **Haz clic** en "Guardar"
4. **En consola**, deberías ver:
   ```
   Guardando en Firestore...
   Guardando estudiantes en Firestore: [ {...} ]
   Estudiantes guardados exitosamente en Firestore
   ```
5. **Ve a Firebase Console** → **Firestore Database** → **students** collection
6. **Deberías ver el nuevo estudiante** ahí ✅

---

## ❌ Si algo NO funciona

### "db disponible: NO"
**Problema:** Firebase no se cargó correctamente
**Solución:**
- Verifica que `firebase.js` existe en la carpeta
- Abre la consola (F12) → Tab "Sources"
- Busca `firebase.js`, ¿aparece?
- Si NO, copia esto a `firebase.js`:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBhgKH6yO6hezJZ0ww--n7EIMXALvWIHk",
  authDomain: "facturaciones-b09de.firebaseapp.com",
  projectId: "facturaciones-b09de",
  storageBucket: "facturaciones-b09de.appspot.com",
  messagingSenderId: "741486889896",
  appId: "1:741486889896:web:b8e5f8f5f9c5a7b3c4d5e6f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### "Estudiantes obtenidos: []" (vacío)
**Problema:** Las colecciones no existen o las reglas no permiten lectura
**Solución:**
- Asegúrate de que creaste las colecciones (`students`, `invoices`, etc.)
- Publica las reglas nuevamente (Step 2c)

### "Error guardando en Firestore" pero sigue funcionando
**Esto está BIEN** - Los datos se guardan en localStorage como respaldo
**Para solucionarlo:**
- Verifica que el nombre de colección sea exacto: `students`, `invoices`, `payments`, `users`
- Revisa que las reglas de Firestore estén correctas (Step 2c)

---

## 📊 Resumen: Dos modos de funcionamiento

| Aspecto | LocalStorage | Firestore |
|---------|-------------|-----------|
| **Dónde se guardan** | En tu computadora | En la nube |
| **Duración** | Solo en este navegador | Permanente |
| **Compartir entre dispositivos** | ❌ NO | ✅ SÍ |
| **Costo** | 💰 GRATIS | 💰 GRATIS (hasta 1GB) |
| **Estado actual** | ✅ FUNCIONANDO | ⚙️ Configurando |

---

## 🎯 Próximos pasos

1. **Ahora mismo**: Prueba guardar un estudiante (funciona con localStorage)
2. **Luego**: Sigue los PASOS 1-4 arriba para activar Firestore
3. **Finalmente**: Recarga la página y verifica que dice "FIRESTORE"

¿Preguntas? Abre la consola (F12) y busca mensajes de error en rojo.
