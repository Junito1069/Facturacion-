# CONFIGURAR FIRESTORE PARA QUE FUNCIONE

## PASO 1: Ir a Firebase Console
1. Abre https://console.firebase.google.com/
2. Selecciona tu proyecto: **facturaciones-b09de**

## PASO 2: Ir a Firestore Database
1. En el menú izquierdo, busca **Firestore Database**
2. Si no existe, crea uno:
   - Click en "Crear base de datos"
   - Selecciona: "Comenzar en modo de prueba"
   - Region: **nam5** (América del Norte) o la más cercana a ti
   - Clic en "Crear"

## PASO 3: Configurar las Reglas de Firestore (IMPORTANTE)
1. En Firestore, ve a la pestaña **Reglas**
2. Borra TODO lo que hay allí
3. Copia y pega EXACTAMENTE esto:

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

4. Click en **Publicar**
5. Espera a que diga "Las reglas se publicaron correctamente"

## PASO 4: Verificar Collections en Firestore
1. En la pestaña **Datos**, deberías ver las colecciones:
   - students
   - invoices
   - payments
   - users

2. Si no existen, abre index.html en tu navegador y haz login. Las colecciones se crearán automáticamente.

## PASO 5: Abre index.html en tu navegador
1. Abre: `c:\Users\blanc\OneDrive\Desktop\prenda\index.html`
2. Presiona **F12** para abrir la consola
3. Verifica que no hay errores rojos
4. Haz login (admin, caja o contabilidad)
5. Ve a **Estudiantes**
6. Deberías ver en la tabla:
   - Ariana López (10° Básico)
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
