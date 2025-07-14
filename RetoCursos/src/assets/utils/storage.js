export function saveSession(user) {
  localStorage.setItem("session", JSON.stringify(user));
}

export function getSession() {
  return JSON.parse(localStorage.getItem("session"));
}

export function clearSession() {
  localStorage.removeItem("session");
}