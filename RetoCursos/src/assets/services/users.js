// services/users.js
const API_URL = "http://localhost:3000/users";

export async function getAllUsers() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function createUser(user) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user)  
  });
  return await res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    const errorText = await res.text(); // para debugging
    console.error("Error al actualizar usuario:", errorText);
    throw new Error("No se pudo actualizar el usuario");
  }

  return await res.json();
}


export async function deleteUser(id) {
  await fetch(`${API_URL}/${id}`, {method: "DELETE"});
}