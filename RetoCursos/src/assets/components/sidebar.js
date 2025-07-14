import { getSession, clearSession } from "../utils/storage.js";

export function renderSidebar(containerId, actions = {}) {
  const user = getSession();
  if (!user) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  let links = "";

  if (user.role === "admin") {
    links = `
      <button id="showUsers">Usuarios</button>
      <button id="showCourses">Cursos</button>
    `;
  }

  if (user.role === "visitor") {
    links = `
      <button id="reloadCourses">Ver Cursos Disponibles</button>
      <button id="reloadMyCourses">Mis Cursos</button>
    `;
  }

  container.innerHTML = `
    <aside style="border-right: 1px solid #ccc; padding: 1rem; min-width: 200px;">
      <h3>${user.role === "admin" ? "Admin" : "Visitante"}</h3>
      ${links}
      <hr>
      <button id="logoutBtn">Cerrar Sesión</button>
    </aside>
  `;

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    window.location.hash = "#/login";
  });

  if (user.role === "admin") {
    document.getElementById("showUsers")?.addEventListener("click", actions.loadUsers);
    document.getElementById("showCourses")?.addEventListener("click", actions.loadCourses);
  }

  if (user.role === "visitor") {
    document.getElementById("reloadCourses")?.addEventListener("click", actions.loadPublicCourses);
    document.getElementById("reloadMyCourses")?.addEventListener("click", actions.loadMyCourses);
  }
}
