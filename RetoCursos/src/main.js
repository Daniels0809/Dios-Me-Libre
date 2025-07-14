import { login, register } from "./assets/services/auth.js";
import { saveSession, getSession, clearSession } from "./assets/utils/storage.js";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "./assets/services/courses.js";
import { getAllUsers, deleteUser, createUser, updateUser } from "./assets/services/users.js";
import { getUserEnrollments, createEnrollment, deleteEnrollment } from "./assets/services/enrollments.js";
import { renderSidebar } from "./assets/components/sidebar.js";
import { renderHeader } from "./assets/components/header.js";

// Rutas de la SPA
const routes = {
  "/": "login",
  "/login": "login",
  "/register": "register",
  "/dashboard": "dashboard",
  "/public": "public",
};

// Cargar vista HTML parcial
async function loadView(view) {
  console.log("Cargando vista:", view);
  const res = await fetch(`/src/assets/pages/${view}.html`);
  const html = await res.text();
  document.getElementById("app").innerHTML = html;
  initScripts(view);
}

// Enrutador SPA
function router() {
  const path = window.location.hash.replace("#", "") || "/";
  const view = routes[path] || "login";
  loadView(view);
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// Scripts específicos por vista
function initScripts(view) {
  if (view === "login") {
    const form = document.getElementById("loginForm");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const user = await login(email, password);
        saveSession(user);
        window.location.hash = user.role === "admin" ? "#/dashboard" : "#/public";
      } catch {
        alert("Credenciales incorrectas");
      }
    });
  }

  if (view === "register") {
    const form = document.getElementById("registerForm");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const userData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        role: "visitor",
        phone: "",
        enrollNumber: "",
        dateOfAdmission: new Date().toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      try {
        const newUser = await register(userData);
        saveSession(newUser);
        window.location.hash = "#/public";
      } catch {
        alert("Error al registrar usuario");
      }
    });
  }

  if (view === "dashboard") {
    const user = getSession();
    if (!user || user.role !== "admin") {
      window.location.hash = "#/login";
      return;
    }

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      clearSession();
      window.location.hash = "#/login";
    });

    document.getElementById("showUsers")?.addEventListener("click", loadUsers);
    document.getElementById("showCourses")?.addEventListener("click", loadCourses);

    renderSidebar("sidebar", { loadUsers, loadCourses });
  }

  if (view === "public") {
    const user = getSession();
    if (!user || user.role !== "visitor") {
      window.location.hash = "#/login";
      return;
    }

    document.getElementById("visitorName").textContent = `Hola, ${user.name}`;
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      clearSession();
      window.location.hash = "#/login";
    });

    loadPublicCourses();
    loadMyCourses();

    renderSidebar("sidebar", { loadPublicCourses, loadMyCourses });
    renderHeader("header");
  }
}


// ==========================
// FUNCIONES DE VISTAS
// ==========================

async function loadPublicCourses() {
  const user = getSession();
  const courses = await getAllCourses();
  const enrollments = await getUserEnrollments(user.id);
  const enrolledCourseIds = enrollments.map(e => e.courseId);

  const container = document.getElementById("courseList");

  container.innerHTML = courses.map(course => {
    const isEnrolled = enrolledCourseIds.includes(course.id);
    return `
      <article style="border:1px solid #ccc; padding:1rem; margin:1rem 0;">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <small><strong>Duración:</strong> ${course.duration}</small><br>
        <small><strong>Inicio:</strong> ${course.startDate}</small><br>
        ${isEnrolled
        ? "<strong style='color:green;'>Ya inscrito</strong>"
        : `<button class="enrollBtn" data-id="${course.id}">Inscribirse</button>`}
      </article>
    `;
  }).join("");

  document.querySelectorAll(".enrollBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const courseId = Number(btn.dataset.id);
      enrollToCourse(courseId);
    });
  });
}
console.log("Inscripciones del usuario:", enrollments);

async function loadMyCourses() {
  const user = getSession();
  const allCourses = await getAllCourses();
  const enrollments = await getUserEnrollments(user.id);
  const container = document.getElementById("myCourses");

  if (enrollments.length === 0) {
    container.innerHTML = "<p>No estás inscrito en ningún curso aún.</p>";
    return;
  }
  console.log("ENROLLMENTS:", enrollments);

  container.innerHTML = enrollments.map(e => {
    const course = allCourses.find(c => c.id === e.courseId);
    return `
    <article class="course-card">
      <h3 class="course-title">${course.title}</h3>
      <p class="course-description">${course.description}</p>
      <div class="course-meta">
        <small><strong>Duración:</strong> ${course.duration}</small>
        <small><strong>Inicio:</strong> ${course.startDate}</small>
      </div>
      <button class="cancelBtn danger" data-id="${e.id}">Cancelar inscripción</button>
    </article>
  `;
  }).join("");


  document.querySelectorAll(".cancelBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const enrollmentId = btn.dataset.id;

      if (confirm("¿Seguro que deseas cancelar esta inscripción?")) {
        try {
          await deleteEnrollment(enrollmentId);
          alert("Inscripción cancelada correctamente ✅");

          await loadPublicCourses(); // Refrescar cursos disponibles
          await loadMyCourses();     // Refrescar lista de cursos inscritos
        } catch (error) {
          alert("Ocurrió un error al cancelar la inscripción.");
          console.error(error);
        }
      }
    });
  });
}

async function enrollToCourse(courseId) {
  const user = getSession();
  const existing = await getUserEnrollments(user.id);
  const already = existing.some(e => e.courseId === courseId);

  if (already) {
    alert("Ya estás inscrito en este curso");
    return;
  }

  await createEnrollment({ userId: user.id, courseId });
  alert("Inscripción exitosa");
  loadPublicCourses();
  loadMyCourses();
}

async function loadUsers() {
  const users = await getAllUsers();
  const content = document.getElementById("adminContent");

  content.innerHTML = `
    <h2>Usuarios</h2>
    <button id="createUserBtn">Crear Usuario</button>
    <table border="1">
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td data-label="ID">${user.id}</td>
            <td data-label="Nombre">${user.name}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Rol">${user.role}</td>
            <td data-label="Acciones">
              <button class="editUser" data-id="${user.id}">Editar</button>
              <button class="deleteUser" data-id="${user.id}">Eliminar</button>
              <button class="viewEnrollments" data-id="${user.id}">Ver cursos</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  // Listeners
  document.getElementById("createUserBtn").onclick = () => showUserForm();

  document.querySelectorAll(".editUser").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const user = users.find(u => u.id == id);
      showUserForm(user);
    };
  });

  document.querySelectorAll(".deleteUser").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (confirm("¿Eliminar usuario?")) {
        await deleteUser(id);
        loadUsers();
      }
    };
  });

  document.querySelectorAll(".viewEnrollments").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      showUserEnrollments(id);
    };
  });
}


function showUserForm(user = null) {
  const modal = document.getElementById("modal");

  modal.innerHTML = `
    <form id="modalForm">
      <input type="hidden" name="id" value="${user?.id || ''}">
      <label>Nombre: <input type="text" name="name" value="${user?.name || ''}" required></label><br>
      <label>Email: <input type="email" name="email" value="${user?.email || ''}" required></label><br>
      <label>Contraseña: <input type="password" name="password" value="${user?.password || ''}" required></label><br>
      <label>Rol:
        <select name="role">
          <option value="visitor" ${user?.role === "visitor" ? "selected" : ""}>Visitante</option>
          <option value="admin" ${user?.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      </label><br>
      <button type="submit">${user ? "Actualizar" : "Crear"}</button>
      <button type="button" id="closeModalBtn">Cerrar</button>
    </form>
  `;

  const form = document.getElementById("modalForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const id = formData.get("id");

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      if (id && id.trim() !== "") {
        await updateUser(id, userData);
        alert("Usuario actualizado ✅");
      } else {
        await createUser(userData);
        alert("Usuario creado ✅");
      }

      modal.style.display = "none";
      loadUsers();
    } catch (err) {
      alert("Error al guardar el usuario ❌\n" + err.message);
      console.error("ERROR COMPLETO:", err);
    }
  });

  // Botón cerrar
  const closeBtn = document.getElementById("closeModalBtn");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.style.display = "block";
}

async function loadCourses() {
  const courses = await getAllCourses();
  const content = document.getElementById("adminContent");

  content.innerHTML = `
    <h2>Cursos</h2>
    <button id="createCourseBtn">Crear Curso</button>
    <table border="1">
      <thead>
        <tr><th>ID</th><th>Título</th><th>Descripción</th><th>Duración</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        ${courses.map(course => `
          <tr>
            <td>${course.id}</td>
            <td>${course.title}</td>
            <td>${course.description}</td>
            <td>${course.duration}</td>
            <td>
              <button class="editCourse" data-id="${course.id}">Editar</button>
              <button class="deleteCourse" data-id="${course.id}">Eliminar</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  document.getElementById("createCourseBtn").onclick = () => showCourseForm();

  document.querySelectorAll(".editCourse").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const course = courses.find(c => c.id == id);
      showCourseForm(course);
    };
  });

  document.querySelectorAll(".deleteCourse").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      if (confirm("¿Eliminar curso?")) {
        await deleteCourse(id);
        loadCourses();
      }
    };
  });
}

function showCourseForm(course = null) {
  const modal = document.getElementById("modal");
  const form = document.getElementById("modalForm");

  form.innerHTML = `
    <label>Título: <input type="text" name="title" value="${course?.title || ''}" required></label><br>
    <label>Descripción: <input type="text" name="description" value="${course?.description || ''}" required></label><br>
    <label>Duración: <input type="text" name="duration" value="${course?.duration || ''}" required></label><br>
    <label>Fecha de inicio: <input type="date" name="startDate" value="${course?.startDate || ''}" required></label><br>
    <button type="submit">${course ? "Actualizar" : "Crear"}</button>
    <button type="button" id="closeModalBtn">Cerrar</button>
  `;

  // Evento para enviar el formulario
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const courseData = Object.fromEntries(formData.entries());

    try {
      if (course) {
        await updateCourse(course.id, courseData);
        alert("Curso actualizado ✅");
      } else {
        await createCourse(courseData);
        alert("Curso creado ✅");
      }

      modal.style.display = "none";
      loadCourses();
    } catch (err) {
      alert("Error al guardar el curso ❌\n" + err.message);
      console.error("ERROR:", err);
    }
  };

  // Evento para cerrar el modal
  const closeBtn = document.getElementById("closeModalBtn");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.style.display = "block";
}

async function showUserEnrollments(userId) {
  const users = await getAllUsers();
  const user = users.find(u => u.id == userId);
  const courses = await getAllCourses();
  const enrollments = await getUserEnrollments(userId);

  const userCourses = enrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId);
    return `<li>${course.title} – ${course.duration}</li>`;
  });

  const form = document.getElementById("modalForm");
  form.innerHTML = `
    <h3>Cursos inscritos por ${user.name}</h3>
    ${userCourses.length ? `<ul>${userCourses.join("")}</ul>` : "<p>Sin cursos inscritos.</p>"}
  `;

  document.getElementById("modal").style.display = "block";
}
