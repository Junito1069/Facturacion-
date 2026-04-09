# ☁️ Configuración de Firestore - Datos Persistentes en la Nube

## 🎯 ¿Qué hace Firestore?
- ✅ Guarda TODOS los datos (estudiantes, facturas, pagos) en la nube
- ✅ Los datos NO se borran al limpiar historial
- ✅ Aparecen en CUALQUIER navegador / dispositivo
- ✅ Sincronización automática

---

## 📋 Pasos para Configurar

### 1️⃣ Ir a Firebase Console
1. Abre [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto **"facturaciones-b09de"**

### 2️⃣ Activar Firestore Database
1. En el menú izquierdo, ve a **Build → Firestore Database**
2. Si ves un botón **"Create Database"**, haz clic en él
3. Selecciona: **"Comenzar en modo de prueba"**
4. Selecciona región: **preferiblemente cerca de ti** (ej: us-east1)
5. Haz clic en **"Create Database"**

### 3️⃣ ⚠️ CRUCIAL: Configurar Reglas de Seguridad
1. En Firestore, anda a la pestaña **"Rules"** (Reglas)
2. **BORRA TODO** el contenido actual
3. **COPIA Y PEGA EXACTAMENTE ESTO:**

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

4. Haz clic en **"Publish"** (Publicar)
5. **Espera 10-15 segundos** a que aparezca el mensaje azul "✅ Rules updated"

### 4️⃣ Verificar en Firestore Console
1. Ve a la pestaña **"Data"** en Firestore
2. Deberías ver las colecciones (al usar la app):
   - `students`
   - `invoices`
   - `payments`
   - `users`

---

## 🧪 Pruebas (Para saber si funcionó)

### ✅ Prueba 1: Recarga la página
1. Abre `c:\Users\blanc\OneDrive\Desktop\prenda\index.html`
2. Haz login (ej: click en "Administrador")
3. Agrega un estudiante nuevo
4. Recarga la página (F5 o Ctrl+R)
5. **El estudiante debe seguir ahí** ✅

### ✅ Prueba 2: Limpia COMPLETO el historial
1. Dale a Ctrl+Shift+Delete
2. Selecciona **"TODO" / "Todos los tiempos"**
3. Marca **"Cookies", "Cache", etc**
4. Haz clic en **"Limpiar datos"**
5. Recarga la página
6. **El estudiante debe SEGUIR AHÍA** ✅ ← Antes esto NO pasaba

### ✅ Prueba 3: Abre en OTRO navegador
1. Abre el URL en **Chrome, Edge, Firefox, etc**
2. Haz login
3. **Los datos aparecen en TODOS lados** ✅

---

## 🚨 Si No Funciona: Solucionar Problemas

| Problema | Solución |
|----------|----------|
| **"Missing or insufficient permissions"** | Las reglas no se publicaron. Ve a paso 3️⃣, copia exactamente y publica de nuevo |
| **"Firestore database not found"** | No creaste la base de datos. Ve a paso 2️⃣ |
| **No vejo las colecciones en Firestore** | Abre la app, agreguega un estudiante, luego actualiza la página de Firebase |
| **Los datos aparecen en un navegador pero no en otro** | Incógnita/Privada: abre ventana incógnita para limpiar cache |

---

## 📝 Explicación Técnica

### Antes (Mal ❌)
- localStorage → Se borra con historial
- Datos solo en 1 navegador

### Ahora (Bien ✅)
- Firestore (nube) → NO se borra
- Datos en TODOS los navegadores
- Persistencia infinita

---

## ✅ Checklist Final - Verificar TODO

- [ ] 1. Fui a Firebase Console
- [ ] 2. Seleccioné "facturaciones-b09de"
- [ ] 3. Creé Firestore Database
- [ ] 4. Cambié las reglas (exactamente como aparecer arriba)
- [ ] 5. Publishé y esperé confirmación
- [ ] 6. Abrí index.html y hice login
- [ ] 7. Agregué un estudiante de prueba
- [ ] 8. Vi el estudiante en Firestore Console
- [ ] 9. Recargué la página - datos siguen ahí ✅
- [ ] 10. Limpié historial completo - datos siguen ahí ✅
- [ ] 11. Abrí en otro navegador - datos aparecen ✅

Si pasaste TODOS los pasos → **¡LISTO!** 🎉

---

## 🎉 Resultado Final

Tu cliente tendrá:
- ☁️ Base de datos en la nube
- 💾 Datos permanentes (nunca se borran)
- 📱 Funciona en celular, tablet, computadora
- 🌐 Accesible desde cualquier lugar
- 🔄 Sincronización automática

**¡Éxito!** 🚀
   - Mateo Castro (8° Básico)

## Si ves errores en la consola (F12):

Si ves algo como:
- "PERMISSION_DENIED"
- "CONFIGURATION_NOT_FOUND"
- Otros errores rojos

### Solución:
1. Vuelve a Firebase Console
2. Verifica que las **Reglas de Firestore** están correctas (Paso 3)
3. Copia y pega nuevamente las reglas si es necesario
4. Haz click en **Publicar**
5. Espera 30 segundos
6. Recarga la página en el navegador (F5)

## Si aún no funciona:

Abre la consola (F12) en el navegador y busca el error. Copia el mensaje de error completo y comparte lo que ves.

Los mensajes importantes que deberías ver son:
- "Iniciando aplicación..."
- "Inicializando almacenamiento en Firestore..."
- "Estudiantes encontrados: 2"
- "Aplicación iniciada correctamente"

Si ves estos mensajes, ¡todo está funcionando!
