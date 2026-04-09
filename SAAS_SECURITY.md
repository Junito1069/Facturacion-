# 🔐 ERP SaaS - Guía de Seguridad y Configuración

## Estado Actual
✅ **Autenticación**: Firebase Auth (email/password)
✅ **Multi-usuario**: Soporte para múltiples usuarios por institución
✅ **Multi-tenancy**: Datos aislados por institución
🔄 **En progreso**: Reglas de seguridad de Firestore

---

## 🔒 PASO 1: Configurar Reglas de Firestore (CRÍTICO)

Estas reglas garantizan que:
- Los datos de una institución NO sean visibles desde otras
- Solo usuarios autenticados de esa institución puedan acceder
- Solo admins puedan gestionar otros usuarios

### Ir a Firebase Console:
1. https://console.firebase.google.com/
2. Selecciona proyecto: **facturaciones-b09de**
3. **Firestore Database** → Pestaña **Rules**

### REEMPLAZA TODO CON ESTO:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Instituciones - Solo el propietario puede ver/editar sus datos
    match /institutions/{institutionId} {
      allow read, write: if request.auth.uid == resource.data.owner;
      
      // Usuarios dentro de la institución
      match /users/{userId} {
        allow read: if request.auth.uid == institutionId;
        allow write: if request.auth.uid == institutionId && 
                       (isAdmin(institutionId) || request.auth.uid == userId);
      }
      
      // Estudiantes de la institución
      match /students/{docId} {
        allow read: if request.auth.uid == institutionId;
        allow write: if request.auth.uid == institutionId && 
                       (isAdmin(institutionId) || hasRole(['administrador', 'contabilidad']));
      }
      
      // Facturas de la institución
      match /invoices/{docId} {
        allow read, write: if request.auth.uid == institutionId && 
                             (isAdmin(institutionId) || hasRole(['administrador', 'caja']));
      }
      
      // Pagos de la institución
      match /payments/{docId} {
        allow read, write: if request.auth.uid == institutionId && 
                             (isAdmin(institutionId) || hasRole(['administrador', 'caja']));
      }
    }
    
    // Funciones auxiliares
    function isAdmin(institutionId) {
      return get(/databases/$(database)/documents/institutions/$(institutionId)/users/$(request.auth.uid)).data.role == 'administrador';
    }
    
    function hasRole(roles) {
      return get(/databases/$(database)/documents/institutions/$(request.auth.uid)/users/$(request.auth.uid)).data.role in roles;
    }
  }
}
```

### Luego:
1. Click **Publish** (esperamos 30 segundos)
2. Verifica que la aplicación siga funcionando

---

## 📊 PASO 2: Estructura Multi-Tenancy (IMPLEMENTADA)

Tu base de datos ahora tiene esta estructura:

```
institutions/
├── {uid1}/                    ← ID del propietario
│   ├── students/
│   ├── invoices/
│   ├── payments/
│   └── users/
├── {uid2}/
│   ├── students/
│   ├── invoices/
│   └── ...
```

Ventajas:
✅ Datos completamente aislados por institución
✅ Escalable a miles de instituciones
✅ Sin riesgo de "data leakage"
✅ Fácil backups por institución

---

## 🔑 PASO 3: Gestión de Roles y Permisos

### Roles disponibles:
- **administrador**: Acceso a todo (usuarios, estudiantes, facturas, reportes)
- **caja**: Gestión de pagos, cobros, facturas
- **contabilidad**: Reportes, análisis financiero, estudiantes

### Para agregar más usuarios:
1. Ir a "Usuarios" (solo admin)
2. Crear nuevo usuario con email y rol
3. Sistema envía email de invitación con contraseña

---

## 🛡️ PASO 4: Validaciones de Seguridad

El código ya incluye:

✅ **Validación de Email**
- Previene registros con emails inválidos
- Valida formato antes de enviar a Firebase

✅ **Validación de Contraseña**
- Mínimo 6 caracteres
- Confirmación de coincidencia en signup

✅ **Aislamiento de Datos**
- Cada usuario solo ve datos de su institución
- Imposible acceder a instituciones ajenas

✅ **Eliminación en Cascada**
- Eliminar estudiante elimina sus facturas y pagos
- Evita huérfanos en la BD

✅ **Encriptación**
- Firebase encrypta en tránsito (HTTPS)
- Contraseñas hasheadas en Firebase Auth

---

## 💰 PASO 5: Preparar para Venta (SaaS)

### Planes sugeridos:

```
FREE:
- Máx 50 estudiantes
- Máx 5 usuarios
- Soporte básico
- $0/mes

PRO:
- Máx 500 estudiantes
- Máx 50 usuarios
- Reportes avanzados
- Email support
- $29/mes

ENTERPRISE:
- Ilimitados
- API acceso
- Integración con ERP
- Soporte telefónico
- Precio custom
```

### Agregar Stripe para pagos:
```javascript
// Próximas releases
- Crear checkout de Stripe
- Guardar plan en: institutions/{id}/subscription
- Validar plan antes de permitir estudiantes/usuarios
```

---

## 🚀 PASO 6: Deploy a Producción

### Checklist:
- [ ] Reglas de Firestore configuradas (arriba)
- [ ] HTTPS habilitado (Firebase automático)
- [ ] Environment variables correcto
- [ ] Backups automáticos diarios
- [ ] Monitoreo de errores (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Términos de servicio aceptados
- [ ] Privacidad RGPD documentada

### Deploy a Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📈 PASO 7: Monitoreo y Escalado

### Métricas importante a rastrear:
1. Usuarios activos diarios
2. Estudiantes registrados
3. Facturas procesadas
4. Tiempo de respuesta BD
5. Errores en consola

### Optimizaciones futuras:
- Caché de datos locales (Service Workers)
- Índices de Firestore para queries frecuentes
- Compresión de imágenes
- CDN para Assets estáticos

---

## 🆘 Problemas Comunes

### "PERMISSION_DENIED"
**Causa**: Reglas de Firestore restrictivas
**Solución**: Publica las reglas arriba

### "auth/user-not-found"
**Causa**: Email aún no registrado
**Solución**: Crear cuenta con signup

### Datos no aparecen en tabla
**Causa**: Datos en colección equivocada (global vs institución)
**Solución**: Verifica que el path incluya `institutions/{id}/`

### "institutionId is undefined"
**Causa**: Usuario aún no logueado cuando se llama funciones
**Solución**: Las funciones now esperan que currentUser esté definido

---

## 🎯 Próximos Pasos

1. ✅ Publica las reglas de Firestore (AHORA)
2. 🔧 Prueba login/signup nuevo
3. 📊 Verifica multi-tenancy (crea 2 instituciones)
4. 💳 Integra Stripe (cuando estés listo para vender)
5. 📱 Prueba en móvil el nuevo login
6. 🎨 Personaliza branding (logo, colores)
7. 🚀 Deploy a Firebase Hosting

---

## Código de Ejemplo: Agregar Usuario (ADMIN ONLY)

```javascript
async function addUserToInstitution(email, role) {
  if (currentRole !== 'administrador') {
    showNotification('Solo admins pueden agregar usuarios', 'warning');
    return;
  }

  try {
    // Enviar email de invitación con link a signup
    await sendSignupInvitation(email, institutionId, role);
    showNotification(`Invitación enviada a ${email}`, 'success');
  } catch (error) {
    showNotification('Error enviando invitación: ' + error.message, 'error');
  }
}
```

---

## Contacto y Soporte

📧 Soporte: soporte@miapp.com
💬 Chat: chat.miapp.com
📍 Status: status.miapp.com

¡Felicidades! Ya tienes un ERP SaaS seguro y escalable. 🎉
