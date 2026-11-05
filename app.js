const filmes = [];
const botao = document.getElementById('abrir-formulario');
const formulario = document.getElementById('form-filme');
const feed = document.getElementById('filmes');
// document.querySelector
// document.querySelectorAll

botao.addEventListener('click', () => {
    formulario.hidden = false;
});

formulario.addEventListener('submit', (event) => {
    event.preventDefault(); //impede de recarregar a página

    const filme = {
        titulo: formulario.elements.titulo.value,
        capa: formulario.elements.capa.value
    };
    filmes.push(filme); // coloca o filme no array de filmes

    const card = document.createElement('article');
    const titulo = document.createElement('h2');
    const capa = document.createElement('img');
    titulo.textContent = filme.titulo;
    capa.src = filme.capa;
    capa.alt = filme.titulo;
    card.append(titulo, capa);
    feed.append(card);

    formulario.reset();
    formulario.hidden = true;
});