# 💻 CODE SNIPPETS - Funcionalidades Futuras para SaaS

## 1️⃣ Agregar Usuario desde Admin Panel

```javascript
// Para agregar en la sección de Usuarios (cuando el admin hace click)
async function inviteUserToInstitution() {
  const email = document.getElementById('inviteEmail').value.trim();
  const role = document.getElementById('inviteRole').value;

  if (!currentUser || currentRole !== 'administrador') {
    showNotification('Solo administradores pueden invitar usuarios', 'warning');
    return;
  }

  if (!email) {
    showNotification('Ingresa un email válido', 'warning');
    return;
  }

  try {
    // 1. Crear usuario en Firebase Auth
    const userCred = await createUserWithEmailAndPassword(auth, email, generateTempPassword());

    // 2. Guardar en Firestore bajo la institución
    await setDoc(doc(db, `institutions/${institutionId}/users`, userCred.user.uid), {
      id: userCred.user.uid,
      uid: userCred.user.uid,
      email: email,
      role: role,
      status: 'activo',
      invitedBy: currentUser.uid,
      invitedAt: new Date().toISOString(),
    });

    // 3. Enviar email de invitación (requiere Cloud Functions)
    // await sendInvitationEmail(email, institutionId, role);

    showNotification(`Invitación enviada a ${email}`, 'success');
    document.getElementById('inviteEmail').value = '';
    await renderUsersTable();
  } catch (error) {
    console.error('Error invitando usuario:', error);
    showNotification('Error: ' + error.message, 'error');
  }
}

function generateTempPassword() {
  // En la práctica, Firestore Cloud Functions enviaría un link de reset
  return Math.random().toString(36).slice(-12);
}
```

---

## 2️⃣ Integración con Stripe (Pagos)

```javascript
// Configuración inicial
const stripe = Stripe('pk_test_YOUR_KEY_HERE');

// Crear checkout para plan
async function createStripeCheckout(planId) {
  if (!institutionId) return;

  try {
    // Llamar Cloud Function para crear session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        institutionId,
        planId,
        email: currentUser.email,
      }),
    });

    const session = await response.json();

    // Redirigir a Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      showNotification('Error: ' + result.error.message, 'error');
    }
  } catch (error) {
    showNotification('Error procesando pago: ' + error.message, 'error');
  }
}

// Guardar suscripción cuando Stripe confirma
async function updateSubscriptionStatus(institutionId, plan, status) {
  await setDoc(doc(db, `institutions/${institutionId}`), {
    subscription: {
      plan: plan, // 'free', 'pro', 'enterprise'
      status: status, // 'active', 'inactive', 'cancelled'
      startDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    }
  }, { merge: true });
}

// Validar plan antes de permitir acciones
async function validatePlanLimit(resource) {
  if (!institutionId) return false;

  const instDoc = await getDoc(doc(db, `institutions/${institutionId}`));
  const plan = instDoc.data().subscription?.plan || 'free';

  const limits = {
    free: { students: 50, users: 5, storage: '1GB' },
    pro: { students: 500, users: 50, storage: '100GB' },
    enterprise: { students: Infinity, users: Infinity, storage: 'Unlimited' },
  };

  const limit = limits[plan][resource];

  if (resource === 'students') {
    const studentCount = (await getStudents()).length;
    if (studentCount >= limit) {
      showNotification(`Plan ${plan} permite máx ${limit} estudiantes. Upgrade para más.`, 'warning');
      return false;
    }
  }

  return true;
}
```

---

## 3️⃣ Envío de Emails con Cloud Functions

```javascript
// Este código va en Cloud Functions (Firebase)
// npm install firebase-functions firebase-admin nodemailer

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-app-password' // O usar SendGrid
  }
});

exports.sendInvitationEmail = functions.https.onCall(async (data, context) => {
  const { email, institutionName, role, inviteLink } = data;

  const mailOptions = {
    from: 'noreply@tuapp.com',
    to: email,
    subject: `¡Invitación a ${institutionName}!`,
    html: `
      <h2>Bienvenido a ${institutionName}</h2>
      <p>Te han invitado como <strong>${role}</strong></p>
      <p>
        <a href="${inviteLink}" style="background: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
          Aceptar invitación
        </a>
      </p>
      <p>Si no solicitaste esta invitación, ignora este email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error enviando email:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.sendPasswordResetEmail = functions.https.onCall(async (data) => {
  // Similar al anterior
});
```

---

## 4️⃣ Backups Automáticos

```javascript
// Cloud Function scheduled (corre diariamente)
exports.dailyBackup = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  const db = admin.firestore();
  const bucket = admin.storage().bucket();

  // Obtener todas las instituciones
  const institutions = await db.collection('institutions').get();

  for (const instDoc of institutions.docs) {
    const backup = {
      institution: instDoc.data(),
      students: (await db.collection(`institutions/${instDoc.id}/students`).get()).docs.map(d => d.data()),
      invoices: (await db.collection(`institutions/${instDoc.id}/invoices`).get()).docs.map(d => d.data()),
      payments: (await db.collection(`institutions/${instDoc.id}/payments`).get()).docs.map(d => d.data()),
      users: (await db.collection(`institutions/${instDoc.id}/users`).get()).docs.map(d => d.data()),
      backupDate: new Date().toISOString(),
    };

    const filename = `backups/${instDoc.id}/backup-${new Date().toISOString()}.json`;
    await bucket.file(filename).save(JSON.stringify(backup, null, 2));
  }

  return { success: true, institutions: institutions.size };
});
```

---

## 5️⃣ Analytics y Tracking

```javascript
// Google Analytics setup
import { initializeAnalytics, logEvent } from "firebase/analytics";

const analytics = initializeAnalytics(app);

// Track eventos importantes
function trackEvent(eventName, data = {}) {
  logEvent(analytics, eventName, data);
}

// Usar en lugares clave:
// Al crear institución
trackEvent('institution_created', { plan: 'free' });

// Al agregar estudiante
trackEvent('student_added', { institutionId, timestamp: Date.now() });

// Al procesar pago
trackEvent('payment_processed', { amount, method, institutionId });

// Métricas útiles
trackEvent('daily_active_user', { role: currentRole });
trackEvent('students_count', { count: students.length });
trackEvent('invoices_amount', { total: invoices.reduce((s,i) => s+i.amount, 0) });
```

---

## 6️⃣ Sistema de Permisos Avanzado

```javascript
// Crear un objeto de permisos por rol
const PERMISSIONS = {
  administrador: ['read_users', 'write_users', 'read_students', 'write_students', 'read_invoices', 'write_invoices', 'read_payments', 'write_payments', 'read_reports', 'manage_institution'],
  caja: ['read_students', 'read_invoices', 'write_invoices', 'read_payments', 'write_payments', 'read_reports'],
  contabilidad: ['read_students', 'read_invoices', 'read_payments', 'read_reports', 'generate_reports'],
};

// Función para validar permiso
function hasPermission(permission) {
  if (!currentRole) return false;
  return PERMISSIONS[currentRole].includes(permission);
}

// Usar en el código:
function deleteStudent(studentId) {
  if (!hasPermission('write_students')) {
    showNotification('No tienes permiso para eliminar estudiantes', 'error');
    return;
  }
  // ... rest del código
}

// Guardar permisos en Firestore para escalabilidad
async function grantPermission(userId, permission) {
  if (!hasPermission('manage_institution')) return;
  
  await updateDoc(doc(db, `institutions/${institutionId}/users/${userId}`), {
    customPermissions: arrayUnion(permission)
  });
}
```

---

## 7️⃣ Auditoría y Logging

```javascript
// Registrar todas las acciones importantes
async function auditLog(action, details) {
  if (!institutionId || !currentUser) return;

  await addDoc(collection(db, `institutions/${institutionId}/audit_logs`), {
    timestamp: new Date().toISOString(),
    userId: currentUser.uid,
    action: action, // 'student_created', 'invoice_deleted', etc.
    details: details,
    ipAddress: await getClientIp(), // Requiere backend
    userAgent: navigator.userAgent,
  });
}

// Usar al hacer cambios:
async function saveStudent() {
  // ... guardar lógica
  await auditLog('student_created', { studentId, name });
}

// Luego poder generar reportes de auditoría
async function getAuditLog(startDate, endDate) {
  const q = query(
    collection(db, `institutions/${institutionId}/audit_logs`),
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate),
  );
  return getDocs(q);
}
```

---

## 8️⃣ Notificaciones en Tiempo Real

```javascript
// Usar Firestore realtime listeners para notificaciones
function subscribeToStudentChanges() {
  return onSnapshot(
    collection(db, `institutions/${institutionId}/students`),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          showNotification(`Nuevo estudiante: ${change.doc.data().name}`, 'success');
        }
        if (change.type === 'modified') {
          showNotification(`Estudiante actualizado: ${change.doc.data().name}`, 'info');
        }
      });
    }
  );
}

// Ejecutar al cargar app
window.addEventListener('DOMContentLoaded', () => {
  subscribeToStudentChanges();
});
```

---

## 9️⃣ Exportar a Excel/PDF Avanzado

```javascript
// Requiere: xlsx library
import * as XLSX from 'xlsx';

async function exportStudentsToExcel() {
  const students = await getStudents();
  
  const worksheet = XLSX.utils.json_to_sheet(students);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
  
  XLSX.writeFile(workbook, `estudiantes-${new Date().toISOString().split('T')[0]}.xlsx`);
}

async function exportStudentsToPDF() {
  const students = await getStudents();
  
  const doc = new jsPDF();
  doc.autoTable({
    head: [['Nombre', 'Curso', 'Tutor', 'Teléfono', 'Estado']],
    body: students.map(s => [s.name, s.course, s.tutor, s.phone, s.status]),
  });
  
  doc.save(`estudiantes-${new Date().toISOString().split('T')[0]}.pdf`);
}
```

---

## 🔟 Modo Offline (Service Workers)

```javascript
// Este código iría en un archivo separado: sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// En index.html:
// <script>
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js');
// }
// </script>
```

---

## 📌 NOTAS IMPORTANTES

1. **Cloud Functions**: Requieren plan **Blaze** (pago) en Firebase
2. **Security**: Nunca almacenes API keys en el cliente
3. **Testing**: Usa Firebase Emulator Suite para testing local
4. **Monitoring**: Configura alertas en Firebase Console
5. **Compliance**: GDPR, CCPA para datos de usuarios

---

## 🚀 Orden de Implementación Recomendado

1. ✅ Auth y Multi-tenancy (YA HECHO)
2. 🔄 Stripe integration (PRÓXIMO)
3. 📧 Cloud Functions + Emails
4. 📊 Analytics setup
5. 🔐 Permisos avanzados
6. 💾 Backups automáticos
7. 🔊 Notificaciones realtime
8. 📄 Export a Excel/PDF
9. ⚡ Offline mode
10. 🎯 Custom branding

---

**¡Éxito implementando estas funcionalidades! 🎉**
