const API_URL = "http://localhost:3000/enrollments";

export async function getUserEnrollments(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}`);
  return await res.json();
}

export async function createEnrollment(data) {
  const res = await fetch("http://localhost:3000/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear inscripción");
  return await res.json();
}

export async function deleteEnrollment(enrollmentId) {
  await fetch(`${API_URL}/${enrollmentId}`, {
    method: "DELETE",
  });
}

