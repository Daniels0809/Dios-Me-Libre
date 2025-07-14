import { getSession, clearSession } from "../utils/storage.js";

export function renderHeader(containerId) {
  const user = getSession();
  if (!user) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <header class="header">
      <div class="user-info">
        <strong>${user.name}</strong> (${user.role})
      </div>
      <button class="logoutBtn">Cerrar sesión</button>
    </header>
  `;

  document.querySelector(".logoutBtn").addEventListener("click", () => {
    clearSession();
    window.location.hash = "#/login";
  });
}

