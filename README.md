# 📚 SPA Gestión de Cursos - JavaScript Vanilla

Este es un proyecto **Single Page Application (SPA)** creado con **JavaScript Vanilla**. Permite la **gestión de cursos y usuarios** con autenticación de roles (admin y visitante), utilizando **JSON Server** como backend simulado.

---

## 🚀 Funcionalidades

### 👥 Autenticación
- Registro de usuarios con rol "visitante"
- Inicio de sesión con redirección según el rol
- Cierre de sesión
- Sesión persistente con `localStorage`

### 🧑‍💼 Panel Admin
- Ver lista de usuarios
- Crear, editar y eliminar usuarios
- Ver cursos en los que está inscrito cada usuario
- Crear, editar y eliminar cursos

### 🙋‍♂️ Panel Visitante
- Ver listado de cursos disponibles
- Inscribirse a cursos
- Ver sus cursos inscritos
- Cancelar inscripción

---

## ⚙️ Instalación y ejecución

### 1. Clona el repositorio
```bash
git clone https://github.com/tu-usuario/spa-cursos.git
cd spa-cursos
```

### 2. Instala JSON Server
```bash
npm install -g json-server
```

### 3. Inicia el servidor
```bash
json-server --watch db.json --port 3000
```

### 4. Abre la app
Abre el archivo `index.html` en tu navegador (puede estar dentro de `/src/` o en la raíz).

---

## 📁 Estructura del proyecto

```
src/
│
├── index.html
├── main.js
├── db.json                # Base de datos falsa (JSON Server)
│
├── assets/
│   ├── pages/             # Vistas HTML parciales (login, register, dashboard, public)
│   ├── services/          # Peticiones a la API JSON Server
│   ├── utils/             # Funciones utilitarias (storage.js)
│   ├── components/        # header.js, sidebar.js
│   └── styles.css         # Estilos CSS
```

---

## 🛠 Tecnologías

- JavaScript Vanilla
- HTML/CSS
- JSON Server (simulación backend REST)

---

## 📌 Notas importantes

- Asegúrate de que el servidor JSON Server esté corriendo en `http://localhost:3000`.
- El sistema usa `window.location.hash` para el enrutamiento SPA.
- Todas las vistas son cargadas dinámicamente desde `/assets/pages/`.

---

## 📸 Capturas (opcional)

_Añade aquí capturas de pantalla de tu app funcionando._

---

## 📄 Licencia

MIT - Uso libre para fines educativos o personales.



solucioname este problema: enrollments.js:21 
 DELETE http://localhost:3000/enrollments/1 404 (Not Found)
deleteEnrollment	@	enrollments.js:21
(anonymous)	@	main.js:212

  document.querySelectorAll(".cancelBtn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const enrollmentId = btn.dataset.id;

      if (confirm("Are you sure you want to cancel this registration?")) {
        try {
          deleteEnrollment(enrollmentId);
          alert("Registration canceled correctly ✅");

          await loadPublicEvents(); // Refrescar cursos disponibles
          await loadMyEvents();     // Refrescar lista de cursos inscritos
        } catch (error) {
          alert("An error occurred while canceling registration.");
          console.error(error);
        }
      }
    });
  });


  export async function deleteEnrollment(enrollmentId) {
  try {
    const response = await fetch( `${API_URL}/${enrollmentId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("DELETE: recurso eliminado correctamente");
      return true;
    } else {
      console.error("Error al eliminar");
      return false;
    }
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}
