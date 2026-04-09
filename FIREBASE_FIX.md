# 🚨 SOLUCIÓN: CONFIGURATION_NOT_FOUND - Firebase Project

## ❌ El Problema
El error `CONFIGURATION_NOT_FOUND` significa que Firebase no puede encontrar tu proyecto. Esto pasa cuando:
- El proyecto fue eliminado
- La API key es inválida
- Hay un problema de facturación

## ✅ SOLUCIÓN RÁPIDA: Crear Nuevo Proyecto Firebase

### PASO 1: Crear Proyecto Nuevo
1. Ve a: https://console.firebase.google.com/
2. Click **"Crear un proyecto"** o **"Create a project"**
3. Nombre del proyecto: `facturaciones-erp-saas`
4. Click **"Continuar"**
5. **DESACTIVA** Google Analytics (no lo necesitamos)
6. Click **"Crear proyecto"**
7. Espera a que se cree (1-2 minutos)

### PASO 2: Configurar Authentication
1. En el menú izquierdo: **Authentication**
2. Click **"Comenzar"**
3. Ve a **"Método de inicio de sesión"**
4. Habilita **"Correo electrónico/contraseña"**
5. Click **"Guardar"**

### PASO 3: Configurar Firestore Database
1. En el menú izquierdo: **Firestore Database**
2. Click **"Crear base de datos"**
3. Selecciona: **"Comenzar en modo de producción"**
4. Región: **us-central1** (o la más cercana)
5. Click **"Crear"**

### PASO 4: Obtener Nueva Configuración
1. Click en el ícono de **engranaje** (⚙️) → **Configuración del proyecto**
2. Baja hasta **"Tus apps"**
3. Si no hay apps, click **"Agregar app"** → **Web app** (</>)
4. Nombre: `ERP SaaS`
5. **IMPORTANTE**: Marca la casilla **"También configurar Firebase Hosting"**
6. Click **"Registrar app"**
7. **Copia la configuración** que aparece (es el objeto `firebaseConfig`)

### PASO 5: Actualizar firebase.js
1. Abre `firebase.js`
2. **REEMPLAZA TODO** el objeto `firebaseConfig` con la nueva configuración
3. **Ejemplo de cómo debería quedar:**
```javascript
const firebaseConfig = {
  apiKey: "NUEVA_API_KEY_AQUI",
  authDomain: "NUEVO_PROJECT_ID.firebaseapp.com",
  projectId: "NUEVO_PROJECT_ID",
  storageBucket: "NUEVO_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "NUEVO_NUMERO",
  appId: "NUEVO_APP_ID"
};
```

### PASO 6: Configurar Reglas de Seguridad
1. Ve a **Firestore Database** → **Reglas**
2. **BORRA TODO** y pega esto:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publicar"**

### PASO 7: Probar la Conexión
1. Abre `index.html` en el navegador
2. Presiona F12 (consola)
3. Deberías ver: `db disponible: SÍ`
4. Si ves `CONFIGURATION_NOT_FOUND`, repite el PASO 5

---

## 🔧 SOLUCIÓN ALTERNATIVA: Usar Solo localStorage

Si no quieres configurar Firebase ahora, la app funciona perfectamente con localStorage:

1. En `index.html`, busca: `const USE_FIRESTORE = true;`
2. Cámbialo a: `const USE_FIRESTORE = false;`
3. Los datos se guardan solo en la computadora (funciona igual)

---

## 🆘 Si el Error Persiste

### Verificar API Key
1. Ve a Firebase Console → Configuración del proyecto → Cuentas de servicio
2. Click en **"Firebase Admin SDK"**
3. Verifica que la API key sea correcta

### Verificar Proyecto Activo
1. Firebase Console → Configuración del proyecto
2. Verifica que diga **"Activo"** en estado del proyecto

### Verificar Facturación
1. Firebase Console → Configuración del proyecto → Uso y facturación
2. Verifica que no estés en overquota

---

## 📞 Contacto de Soporte

Si nada funciona:
- Firebase Support: https://firebase.google.com/support
- Documentación: https://firebase.google.com/docs/web/setup

---

## ✅ Checklist Final

- [ ] Proyecto Firebase creado
- [ ] Authentication configurado
- [ ] Firestore Database creado
- [ ] firebase.js actualizado con nueva config
- [ ] Reglas de seguridad publicadas
- [ ] index.html abre sin errores
- [ ] Login funciona
- [ ] Datos se guardan en Firestore

¡La app debería funcionar ahora! 🎉</content>
<parameter name="filePath">c:\Users\blanc\OneDrive\Desktop\prenda\FIREBASE_FIX.md