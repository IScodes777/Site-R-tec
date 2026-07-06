// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://rthnvwelgjuxkfgszokl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g4QPAx09PbmKUYwIia_8dA__aTdL9mO';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variáveis de controle para o carrossel de fotos funcionar
let fotosDoProdutoAtual = [];
let indiceFotoAtiva = 0;

// --- FUNÇÃO AUXILIAR: TRATAMENTO SEGURO DO ARRAY DE FOTOS ---
// Garante que o retorno seja sempre um Array de URLs, independente de como está no banco
function extrairFotos(fotoDado) {
    if (Array.isArray(fotoDado)) {
        return fotoDado;
    }
    if (typeof fotoDado === 'string') {
        try {
            if (fotoDado.startsWith('[')) {
                return JSON.parse(fotoDado);
            }
            return [fotoDado];
        } catch (e) {
            return [fotoDado];
        }
    }
    return [];
}

// --- FUNÇÃO AUXILIAR: RENDERIZAR OS CARDS E CONFIGURAR O MODAL ---
function renderizarProdutosNaTela(listaProdutos) {
    const container = document.getElementById('container-produtos');
    container.innerHTML = ''; 

    if (!listaProdutos || listaProdutos.length === 0) {
        container.innerHTML = '<p style="padding: 20px;">Nenhum produto encontrado.</p>';
        return;
    }

    // 1. Gera o HTML de todos os cards
    listaProdutos.forEach((produto, index) => {
        const arrayFotos = extrairFotos(produto.foto);
        const fotoPrincipal = arrayFotos[0] || 'https://via.placeholder.com/150'; 
        const precoFormatado = produto.preco ? parseFloat(produto.preco).toFixed(2) : '0.00';

        const cardHTML = `
            <div class="column card" data-index="${index}" style="cursor:pointer; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                <img src="${fotoPrincipal}" alt="${produto.nome}" style="width:100%; max-height: 200px; object-fit: cover;">
                <h2>${produto.nome}</h2>
                <p><strong>Cor:</strong> ${produto.cor || 'N/A'}</p>
                <p><strong>Marca:</strong> ${produto.marca || 'N/A'}</p>
                <span class="preco"><strong>Preço:</strong> R$ ${precoFormatado}</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // 2. Adiciona o evento de clique nos cards para abrir o Modal com o CARROSSEL de fotos
    document.querySelectorAll('#container-produtos .card').forEach((card) => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            const produto = listaProdutos[index];
            
            // Salva as fotos globalmente e zera o índice do slide para a primeira foto
            fotosDoProdutoAtual = extrairFotos(produto.foto);
            indiceFotoAtiva = 0;

            const precoFormatado = produto.preco ? parseFloat(produto.preco).toFixed(2) : '0.00';

            // Preenche os textos do Modal
            document.getElementById('modal-nome').textContent = produto.nome;
            document.getElementById('modal-descricao').textContent = produto.descricao || '';
            document.getElementById('modal-cor').textContent = produto.cor || '';
            document.getElementById('modal-marca').textContent = produto.marca || '';
            document.getElementById('modal-tipo').textContent = produto.tipo || '';
            document.getElementById('modal-preco').textContent = `R$ ${precoFormatado}`;
            document.getElementById('modal').style.display = 'block';

            // Chama a função interna para desenhar o carrossel com as setas
            atualizarCarrosselModal();
        });
    });
}

// --- FUNÇÃO PARA CRIAR E ATUALIZAR O CARROSSEL COM SETAS ---
function atualizarCarrosselModal() {
    const fotosContainer = document.getElementById('modal-fotos-container');
    if (!fotosContainer) return;

    fotosContainer.innerHTML = ''; // Limpa o container para recriar o slide
    
    // Deixa o container alto o suficiente para caber a imagem confortavelmente
    fotosContainer.style.flexDirection = 'column';
    fotosContainer.style.justifyContent = 'center';
    fotosContainer.style.minHeight = '250px';

    if (fotosDoProdutoAtual.length === 0) {
        fotosContainer.innerHTML = '<p style="color:#666;">Nenhuma foto cadastrada para este produto.</p>';
        return;
    }

    // Cria a linha que segura a Seta Esquerda -> Imagem -> Seta Direita
    const linhaSlide = document.createElement('div');
    linhaSlide.style.cssText = "display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 10px;";

    // 1. Seta Esquerda (Anterior)
    const btnAnterior = document.createElement('button');
    btnAnterior.innerHTML = '&#10094;'; // Caractere ❮
    btnAnterior.type = 'button';
    btnAnterior.style.cssText = "background: #e2e8f0; border: none; color: #334155; font-size: 20px; font-weight: bold; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0;";
    // Se for a primeira foto, esconde a seta esquerda
    btnAnterior.style.visibility = (indiceFotoAtiva > 0) ? 'visible' : 'hidden';
    btnAnterior.onclick = () => {
        indiceFotoAtiva--;
        atualizarCarrosselModal();
    };

    // 2. Imagem do Slide Atual
    const imgSlide = document.createElement('img');
    imgSlide.src = fotosDoProdutoAtual[indiceFotoAtiva];
    imgSlide.style.cssText = "width: 100%; max-width: 200px; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;justify-content: center; display: block; margin: 0 auto;";

    // 3. Seta Direita (Próxima)
    const btnProxima = document.createElement('button');
    btnProxima.innerHTML = '&#10095;'; // Caractere ❯
    btnProxima.type = 'button';
    btnProxima.style.cssText = "background: #e2e8f0; border: none; color: #334155; font-size: 20px; font-weight: bold; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0;";
    // Se for a última foto, esconde a seta direita
    btnProxima.style.visibility = (indiceFotoAtiva < fotosDoProdutoAtual.length - 1) ? 'visible' : 'hidden';
    btnProxima.onclick = () => {
        indiceFotoAtiva++;
        atualizarCarrosselModal();
    };

    // 4. Legenda indicadora embaixo (Ex: 2 de 4)
    const indicadorPagina = document.createElement('span');
    indicadorPagina.innerText = `${indiceFotoAtiva + 1} de ${fotosDoProdutoAtual.length}`;
    indicadorPagina.style.cssText = "font-size: 13px; font-weight: bold; color: #64748b; margin-top: 8px; font-family: sans-serif;";

    // Se só tiver uma única foto cadastrada, as setas e a legenda não precisam poluir a tela
    if (fotosDoProdutoAtual.length === 1) {
        btnAnterior.style.display = 'none';
        btnProxima.style.display = 'none';
        indicadorPagina.style.display = 'none';
    }

    // Monta a estrutura dentro do HTML
    linhaSlide.appendChild(btnAnterior);
    linhaSlide.appendChild(imgSlide);
    linhaSlide.appendChild(btnProxima);

    fotosContainer.appendChild(linhaSlide);
    fotosContainer.appendChild(indicadorPagina);
}

// --- FUNÇÃO: CARREGAR TODOS OS PRODUTOS ---
async function carregarProdutos() {
    const { data: listaProdutos, error } = await supabaseClient
        .from('produtos')
        .select('*');

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        return;
    }

    renderizarProdutosNaTela(listaProdutos);
}

// --- FUNÇÃO: BUSCAR POR NOME ---
async function buscarProdutosPorNome(nome) {
    const { data: listaProdutos, error } = await supabaseClient
        .from('produtos')
        .select('*')
        .ilike('nome', `%${nome}%`);

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        return;
    }

    renderizarProdutosNaTela(listaProdutos);
}

// --- FUNÇÃO: BUSCAR POR CATEGORIA ---
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

    renderizarProdutosNaTela(listaProdutos);
}

// --- EVENTOS DE INTERAÇÃO (LISTENERS) ---

// Fechar modal
document.getElementById('fechar').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};

// Botão de busca por nome
document.getElementById('botao-buscar').addEventListener('click', () => {
    const nomeProduto = document.getElementById('pesquisa').value.trim();
    if (nomeProduto) {
        buscarProdutosPorNome(nomeProduto);
    } else {
        carregarProdutos();
    }
});

// Botões de categoria
document.querySelectorAll('.categorias button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.categorias button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const categoria = button.textContent.trim();
        buscarProdutosPorCategoria(categoria);
    });
});

// Inicialização automática ao carregar a página
window.addEventListener('DOMContentLoaded', carregarProdutos);