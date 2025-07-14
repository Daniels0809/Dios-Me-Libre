# Dios-Me-Libre

📚 SPA Gestión de Cursos - JavaScript Vanilla
Este es un proyecto Single Page Application (SPA) creado con JavaScript Vanilla. Permite la gestión de cursos y usuarios con autenticación de roles (admin y visitante), utilizando JSON Server como backend simulado.

🚀 Funcionalidades
👥 Autenticación
Registro de usuarios con rol "visitante"

Inicio de sesión con redirección según el rol

Cierre de sesión

Sesión persistente con localStorage

🧑‍💼 Panel Admin
Ver lista de usuarios

Crear, editar y eliminar usuarios

Ver cursos en los que está inscrito cada usuario

Crear, editar y eliminar cursos

🙋‍♂️ Panel Visitante
Ver listado de cursos disponibles

Inscribirse a cursos

Ver sus cursos inscritos

Cancelar inscripción

⚙️ Instalación y ejecución
1. Clona el repositorio
bash
Copiar
Editar
git clone https://github.com/tu-usuario/spa-cursos.git
cd spa-cursos
2. Instala JSON Server
bash
Copiar
Editar
npm install -g json-server
3. Inicia el servidor
bash
Copiar
Editar
json-server --watch db.json --port 3000
4. Abre la app
Abre el archivo index.html en tu navegador (puede estar dentro de /src/ o en la raíz).

📁 Estructura del proyecto
pgsql
Copiar
Editar
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
🛠 Tecnologías
JavaScript Vanilla

HTML/CSS

JSON Server (simulación backend REST)

📌 Notas importantes
Asegúrate de que el servidor JSON Server esté corriendo en http://localhost:3000.

El sistema usa window.location.hash para el enrutamiento SPA.

Todas las vistas son cargadas dinámicamente desde /assets/pages/.

📸 Capturas (opcional)
Añade aquí capturas de pantalla de tu app funcionando.

📄 Licencia
MIT - Uso libre para fines educativos o personales.
