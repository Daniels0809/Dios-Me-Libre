const API_URL = "http://localhost:3000/users";

export async function login(email, password) {
    //creamos la respuesta en el que haremos una solicitud HTTP con fetch
    //contruyendo la URL e iniciando parametros de consulta incluyendo email y password
    //usamos async await para esperar que la solicitud se confirme y devolver la respuesta
    const res = await fetch(`${API_URL}?email=${email}&password=${password}`)
    //usamos awair por que el json fue una operacion asincrona
    //por lo que users sera un arreglo de objetos
    const users = await res.json();
    //revisamos que al menos encontro algun usuario y lo devuelve si no lo encuentra entonces devolvera null
    return users.length > 0 ? users[0] : null;
}

export async function register(userData) {
    // Enviamos una solicitud POST al servidor con los datos del nuevo usuario
    const res = await fetch(API_URL, {
        method: 'POST', // método POST para crear un nuevo recurso
        headers: {
            "Content-Type": "application/json" // el tipo de contenido que enviamos (JSON)
        },
        body: JSON.stringify(userData) // convertimos los datos del usuario a texto JSON
    });

    if (!res.ok) {
        throw new Error("Error al registrar usuario")
    }

    // Esperamos la respuesta del servidor y la convertimos en objeto JavaScript
    return await res.json();
}
