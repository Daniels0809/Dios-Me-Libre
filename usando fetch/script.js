const boton = document.querySelector('#found');
const restartBoton = document.querySelector('#restart');

boton.addEventListener("click", function(e){
    e.preventDefault();

    const inputValue = document.querySelector('input').value;

    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=838414bc&s=${inputValue}`)
    .then(response => response.json())
    .then(data => displayData(data))
})


restartBoton.addEventListener("click", function(){
    location.reload()
})


function displayData(data){
    const dataContainer = document.querySelector("#api-data")
    dataContainer.innerHTML = ''

    data.Search.forEach(item => {
        const itemElement = document.createElement('div')
        itemElement.innerHTML = `
        <h3>${item.Title}</h3>
        <p>${item.Year}</p>
        <img src=${item.Poster}/>
        `
        dataContainer.appendChild(itemElement)
    });
}
    
