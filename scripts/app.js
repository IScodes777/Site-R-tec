// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://rthnvwelgjuxkfgszokl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g4QPAx09PbmKUYwIia_8dA__aTdL9mO';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function carregarProdutos() {
    // IMPORTANTE: Mude de 'supabase.from' para 'supabaseClient.from'
    const { data: listaProdutos, error } = await supabaseClient
        .from('produtos')
        .select('*');

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        return;
    }

    const container = document.getElementById('container-produtos');
    container.innerHTML = ''; 

    listaProdutos.forEach(produto => {
        const cardHTML = `
            <div class="column card">
                <img src="${produto.foto}" alt="${produto.nome}" style="width:100%">
                <h2>${produto.nome}</h2>
                <p><strong>Cor:</strong> ${produto.cor}</p>
                <p><strong>Marca:</strong> ${produto.marca}</p>
                <span class="preco"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const produto = listaProdutos[index];
            document.getElementById('modal-foto').src = produto.foto;
            document.getElementById('modal-nome').textContent = produto.nome;
            document.getElementById('modal-descricao').textContent = produto.descricao;
            document.getElementById('modal-cor').textContent = produto.cor;
            document.getElementById('modal-marca').textContent = produto.marca;
            document.getElementById('modal-tipo').textContent = produto.tipo;
            document.getElementById('modal-preco').textContent = `R$ ${produto.preco}`;
            document.getElementById('modal').style.display = 'block';
        });
    });

    // Fechar modal
    document.getElementById('fechar').onclick = () => {
        document.getElementById('modal').style.display = 'none';
    };

}

async function buscarProdutosPorNome(nome) {
    const { data: listaProdutos, error } = await supabaseClient
        .from('produtos')
        .select('*')
        .ilike('nome', `%${nome}%`);

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        return;
    }

    const container = document.getElementById('container-produtos');
    container.innerHTML = '';

    listaProdutos.forEach(produto => {
        const cardHTML = `
            <div class="column card">
                <img src="${produto.foto}" alt="${produto.nome}" style="width:100%">
                <h2>${produto.nome}</h2>
                <p><strong>Cor:</strong> ${produto.cor}</p>
                <p><strong>Marca:</strong> ${produto.marca}</p>
                <span class="preco"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const produto = listaProdutos[index];
            document.getElementById('modal-foto').src = produto.foto;
            document.getElementById('modal-nome').textContent = produto.nome;
            document.getElementById('modal-descricao').textContent = produto.descricao;
            document.getElementById('modal-cor').textContent = produto.cor;
            document.getElementById('modal-marca').textContent = produto.marca;
            document.getElementById('modal-tipo').textContent = produto.tipo;
            document.getElementById('modal-preco').textContent = `R$ ${produto.preco}`;
            document.getElementById('modal').style.display = 'block';
        });
    });

    // Fechar modal
    document.getElementById('fechar').onclick = () => {
        document.getElementById('modal').style.display = 'none';
    };
}

// Adiciona o evento de clique ao botão de busca
document.getElementById('botao-buscar').addEventListener('click', () => {
    const nomeProduto = document.getElementById('pesquisa').value.trim();
    if (nomeProduto) {
        buscarProdutosPorNome(nomeProduto);
    } else {
        carregarProdutos(); // Carrega todos os produtos se o campo de busca estiver vazio
    }
});

async function buscarProdutosPorCategoria(categoria) {
    if (categoria === 'Ver todos') {
        carregarProdutos();
        return;
    }
    const { data: listaProdutos, error } = await supabaseClient
        .from('produtos')
        .select('*')
        .eq('categoria', categoria);

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        return;
    }

    const container = document.getElementById('container-produtos');
    container.innerHTML = '';

    listaProdutos.forEach(produto => {
        const cardHTML = `
            <div class="column card">
                <img src="${produto.foto}" alt="${produto.nome}" style="width:100%">
                <h2>${produto.nome}</h2>
                <p><strong>Cor:</strong> ${produto.cor}</p>
                <p><strong>Marca:</strong> ${produto.marca}</p>
                <span class="preco"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const produto = listaProdutos[index];
            document.getElementById('modal-foto').src = produto.foto;
            document.getElementById('modal-nome').textContent = produto.nome;
            document.getElementById('modal-descricao').textContent = produto.descricao;
            document.getElementById('modal-cor').textContent = produto.cor;
            document.getElementById('modal-marca').textContent = produto.marca;
            document.getElementById('modal-tipo').textContent = produto.tipo;
            document.getElementById('modal-preco').textContent = `R$ ${produto.preco}`;
            document.getElementById('modal').style.display = 'block';
        });
    });

    // Fechar modal
    document.getElementById('fechar').onclick = () => {
        document.getElementById('modal').style.display = 'none';
    };
}

// Adiciona eventos de clique aos botões de categoria
document.querySelectorAll('.categorias button').forEach(button => {
    button.addEventListener('click', () => {
        const categoria = button.textContent;
        buscarProdutosPorCategoria(categoria);
        switch (categoria) {
            case 'Ver todos':
                button.classList.add('active');
                break;
            case 'Acessórios':
                button.classList.add('active');
                break;
            case 'Gamer':
                button.classList.add('active');
                break;
            case 'Celulares':
                button.classList.add('active');
                break;
            case 'Aparelhos de áudio':
                button.classList.add('active');
                break;
        }
        document.querySelectorAll('.categorias button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Carrega os produtos quando a página é carregada 

window.addEventListener('DOMContentLoaded', carregarProdutos);