const API_URL = "http://localhost:3000/courses";

export async function getAllCourses() {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function createCourse(course) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  return await res.json();
}

export async function updateCourse(id, course) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  return await res.json();
}

export async function deleteCourse(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}