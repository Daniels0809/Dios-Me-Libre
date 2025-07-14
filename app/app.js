
const url = "http://localhost:3000/users"

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener el archivo JSON")
        }

        return response.json();
    })

    .then(data => {
        console.log(data);

        const tableBody = document.querySelector('#users-table tbody')

        data.forEach(user => {
            const tableRow = document.createElement('tr');
            tableRow.innerHTML = `
                <th scope="row">${user.id}</th>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.username}</td>
            `
            tableBody.appendChild(tableRow);
        });
    })

    .catch(error => {
        console.error('Error', error);

    });