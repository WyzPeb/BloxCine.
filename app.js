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
    event.preventDefault(); 
    const filme = {
        titulo: formulario.elements.titulo.value,
        capa: formulario.elements.capa.value
    };
    filmes.push(filme); 

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

(function () {
    const campoTitulo = formulario.elements.titulo;
    const campoCapa = formulario.elements.capa;
    const campoAlt = formulario.elements.alt;
    const campoAssistir = formulario.elements.assistir;
    const campoSinopse = formulario.elements.sinopse;
    const grupoEstrelas = document.getElementById('avaliacao-estrelas');
    const botoesEstrela = grupoEstrelas.querySelectorAll('.estrela-btn');
    const botaoCancelar = document.getElementById('cancelar-filme');    
    function obterAreaCards() {
        return document.querySelector('.grade-filmes') || feed;
    }

    let avaliacaoAtual = 0;

    formulario.noValidate = true;

    function pintarEstrelas(ate) {
        botoesEstrela.forEach((b) => {
            b.classList.toggle('ativa', Number(b.dataset.valor) <= ate);
        });
    }

    botoesEstrela.forEach((b) => {
        b.addEventListener('click', () => {
            avaliacaoAtual = Number(b.dataset.valor);
            pintarEstrelas(avaliacaoAtual);
            limparErro(grupoEstrelas);
        });
        b.addEventListener('mouseenter', () => pintarEstrelas(Number(b.dataset.valor)));
    });
    grupoEstrelas.addEventListener('mouseleave', () => pintarEstrelas(avaliacaoAtual));

    function spanErro(ref) {
        let span = ref.parentElement.querySelector('.erro-campo');
        if (!span) {
            span = document.createElement('span');
            span.className = 'erro-campo';
            span.setAttribute('role', 'alert');
            ref.parentElement.append(span);
        }
        return span;
    }

    function mostrarErro(ref, mensagem) {
        spanErro(ref).textContent = mensagem;
        ref.setAttribute('aria-invalid', 'true');
    }

    function limparErro(ref) {
        spanErro(ref).textContent = '';
        ref.removeAttribute('aria-invalid');
    }

    function limparTodosErros() {
        [campoTitulo, campoCapa, campoAlt, campoAssistir, campoSinopse, grupoEstrelas]
            .forEach(limparErro);
    }

    function urlValida(valor) {
        try {
            const u = new URL(valor);
            return u.protocol === 'http:' || u.protocol === 'https:';
        } catch {
            return false;
        }
    }

        function criarCardFilme(f) {
        const card = document.createElement('div');
        card.className = 'filme movie-card filme-novo';

        const img = document.createElement('img');
        img.src = f.capa;
        img.alt = f.alt;
        img.loading = 'lazy';

        const sinopse = document.createElement('p');
        sinopse.className = 'sinopse';
        sinopse.textContent = f.sinopse;

        const info = document.createElement('div');
        info.className = 'card-info';

        const nome = document.createElement('span');
        nome.className = 'titulo-filme';
        nome.textContent = f.titulo;

        const estrelas = document.createElement('div');
        estrelas.className = 'estrelas';
        estrelas.setAttribute('aria-label', f.avaliacao + ' de 5 estrelas');
        for (let i = 1; i <= 5; i++) {
            const e = document.createElement('span');
            e.textContent = '★';
            e.className = i <= f.avaliacao ? 'estrela-cheia' : 'estrela-vazia';
            estrelas.append(e);
        }

        info.append(nome, estrelas);

        const botaoAssista = document.createElement('a');
        botaoAssista.className = 'botao-assista';
        botaoAssista.href = f.assistir;
        botaoAssista.target = '_blank';
        botaoAssista.rel = 'noopener noreferrer';
        botaoAssista.textContent = 'ASSISTA AGORA!';

        card.append(img, sinopse, info, botaoAssista);

        card.addEventListener('click', (event) => {
            if (event.target.closest('a')) return; // o botão já abre sozinho
            window.open(f.assistir, '_blank', 'noopener,noreferrer');
        });

        return card;
    }

    document.addEventListener('submit', (event) => {
        if (event.target !== formulario) return;

        event.preventDefault();
        event.stopPropagation();
        limparTodosErros();

        const dados = {
            titulo: campoTitulo.value.trim(),
            capa: campoCapa.value.trim(),
            alt: campoAlt.value.trim(),
            assistir: campoAssistir.value.trim(),
            sinopse: campoSinopse.value.trim(),
            avaliacao: avaliacaoAtual
        };

        let valido = true;
        let primeiroComErro = null;

        function checar(condicao, ref, mensagem, foco) {
            if (!condicao) {
                mostrarErro(ref, mensagem);
                valido = false;
                primeiroComErro = primeiroComErro || (foco || ref);
            }
        }

        checar(dados.titulo !== '', campoTitulo, 'Digite o nome do filme.');
        checar(
            dados.capa !== '' && urlValida(dados.capa),
            campoCapa,
            dados.capa === '' ? 'Informe o link da capa.' : 'O link da capa é inválido (use http:// ou https://).'
        );
        checar(dados.alt !== '', campoAlt, 'Descreva a imagem no campo ALT.');
        checar(
            dados.assistir !== '' && urlValida(dados.assistir),
            campoAssistir,
            dados.assistir === '' ? 'Informe o link de onde assistir.' : 'O link de onde assistir é inválido (use http:// ou https://).'
        );
        checar(dados.sinopse !== '', campoSinopse, 'Escreva a sinopse do filme.');
        checar(dados.avaliacao >= 1, grupoEstrelas, 'Escolha de 1 a 5 estrelas.', botoesEstrela[0]);

        if (!valido) {
            primeiroComErro.focus();
            return;
        }

        filmes.push(dados);
        obterAreaCards().append(criarCardFilme(dados));

        formulario.reset();
        formulario.hidden = true;
    }, true);

    formulario.addEventListener('reset', () => {
        avaliacaoAtual = 0;
        pintarEstrelas(0);
        limparTodosErros();
    });

    botaoCancelar.addEventListener('click', () => {
        formulario.reset();
        formulario.hidden = true;
    });
})();