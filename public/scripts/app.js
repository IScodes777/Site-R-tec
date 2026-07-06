// CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://rthnvwelgjuxkfgszokl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g4QPAx09PbmKUYwIia_8dA__aTdL9mO';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Variáveis de controle para o carrossel de fotos funcionar
let fotosDoProdutoAtual = [];
let indiceFotoAtiva = 0;

// --- FUNÇÃO AUXILIAR: TRATAMENTO SEGURO DO ARRAY DE FOTOS ---
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

    // 1. Gera o HTML de todos os cards (Removido estilos inline conflitantes com o CSS)
    listaProdutos.forEach((produto, index) => {
        const arrayFotos = extrairFotos(produto.foto);
        const fotoPrincipal = arrayFotos[0] || 'https://via.placeholder.com/150'; 
        const precoFormatado = produto.preco ? parseFloat(produto.preco).toFixed(2) : '0.00';

        const cardHTML = `
            <div class="column card" data-index="${index}" style="cursor:pointer;">
                <img src="${fotoPrincipal}" alt="${produto.nome}">
                <h2>${produto.nome}</h2>
                <p><strong>Cor:</strong> ${produto.cor || 'N/A'}</p>
                <p><strong>Marca:</strong> ${produto.marca || 'N/A'}</p>
                <span class="preco"><strong>Preço:</strong> R$ ${precoFormatado}</span>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // 2. Adiciona o evento de clique nos cards (Suporta toques mobile perfeitamente)
    // 2. Adiciona o evento de clique nos cards
    document.querySelectorAll('#container-produtos .card').forEach((card) => {
        card.addEventListener('click', () => {
            const index = card.getAttribute('data-index');
            const produto = listaProdutos[index];
            
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
            
            // ==================== NOVO BLOCO DO WHATSAPP ====================
            const linkWhats = document.getElementById('btn-whatsapp');
            if (linkWhats) {
                // Codifica o nome do produto para evitar problemas com espaços ou acentos na URL
                const mensagem = encodeURIComponent(`Olá R-tec, gostaria de saber mais sobre o produto: ${produto.nome}`);
                linkWhats.href = `https://wa.me/558994039358?text=${mensagem}`;
            }
            // ================================================================

            document.getElementById('modal').style.display = 'block';

            // Garante que o modal abra no topo da tela
            document.getElementById('modal').scrollTop = 0;

            atualizarCarrosselModal();
        });
    });
}

// --- FUNÇÃO PARA CRIAR E ATUALIZAR O CARROSSEL COM SETAS ---
function atualizarCarrosselModal() {
    const fotosContainer = document.getElementById('modal-fotos-container');
    if (!fotosContainer) return;

    fotosContainer.innerHTML = ''; 
    
    fotosContainer.style.flexDirection = 'column';
    fotosContainer.style.justifyContent = 'center';
    fotosContainer.style.minHeight = '250px';

    if (fotosDoProdutoAtual.length === 0) {
        fotosContainer.innerHTML = '<p style="color:#666;">Nenhuma foto cadastrada para este produto.</p>';
        return;
    }

    const linhaSlide = document.createElement('div');
    linhaSlide.style.cssText = "display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 10px;";

    // 1. Seta Esquerda (Aumentada para facilidade de toque no celular: 44px)
    const btnAnterior = document.createElement('button');
    btnAnterior.innerHTML = '&#10094;'; 
    btnAnterior.type = 'button';
    btnAnterior.style.cssText = "background: #e2e8f0; border: none; color: #334155; font-size: 22px; font-weight: bold; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0; -webkit-tap-highlight-color: transparent;";
    btnAnterior.style.visibility = (indiceFotoAtiva > 0) ? 'visible' : 'hidden';
    btnAnterior.onclick = (e) => {
        e.stopPropagation(); // Evita bugs de clique duplo em mobile
        indiceFotoAtiva--;
        atualizarCarrosselModal();
    };

    // 2. Imagem do Slide Atual (Largura adaptável para telas menores)
    const imgSlide = document.createElement('img');
    imgSlide.src = fotosDoProdutoAtual[indiceFotoAtiva];
    imgSlide.style.cssText = "width: 100%; max-width: 220px; height: 220px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block; margin: 0 auto;";

    // 3. Seta Direita (Aumentada para 44px)
    const btnProxima = document.createElement('button');
    btnProxima.innerHTML = '&#10095;'; 
    btnProxima.type = 'button';
    btnProxima.style.cssText = "background: #e2e8f0; border: none; color: #334155; font-size: 22px; font-weight: bold; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink: 0; -webkit-tap-highlight-color: transparent;";
    btnProxima.style.visibility = (indiceFotoAtiva < fotosDoProdutoAtual.length - 1) ? 'visible' : 'hidden';
    btnProxima.onclick = (e) => {
        e.stopPropagation();
        indiceFotoAtiva++;
        atualizarCarrosselModal();
    };

    // 4. Legenda indicadora
    const indicadorPagina = document.createElement('span');
    indicadorPagina.innerText = `${indiceFotoAtiva + 1} de ${fotosDoProdutoAtual.length}`;
    indicadorPagina.style.cssText = "font-size: 14px; font-weight: bold; color: #64748b; margin-top: 10px; font-family: sans-serif;";

    if (fotosDoProdutoAtual.length === 1) {
        btnAnterior.style.display = 'none';
        btnProxima.style.display = 'none';
        indicadorPagina.style.display = 'none';
    }

    linhaSlide.appendChild(btnAnterior);
    linhaSlide.appendChild(imgSlide);
    linhaSlide.appendChild(btnProxima);

    fotosContainer.appendChild(linhaSlide);
    fotosContainer.appendChild(indicadorPagina);
}

// --- FUNÇÕES DE BUSCA (SUPABASE) ---
async function carregarProdutos() {
    const { data: listaProdutos, error } = await supabaseClient.from('produtos').select('*');
    if (error) { console.error(error.message); return; }
    renderizarProdutosNaTela(listaProdutos);
}

async function buscarProdutosPorNome(nome) {
    const { data: listaProdutos, error } = await supabaseClient.from('produtos').select('*').ilike('nome', `%${nome}%`);
    if (error) { console.error(error.message); return; }
    renderizarProdutosNaTela(listaProdutos);
}

async function buscarProdutosPorCategoria(categoria) {
    if (categoria === 'Ver todos') { carregarProdutos(); return; }
    const { data: listaProdutos, error } = await supabaseClient.from('produtos').select('*').eq('categoria', categoria);
    if (error) { console.error(error.message); return; }
    renderizarProdutosNaTela(listaProdutos);
}

// --- EVENTOS DE INTERAÇÃO (LISTENERS) ---

// Fechar modal ao clicar no botão ou fora do conteúdo (Ótimo para Mobile UX)
document.getElementById('fechar').onclick = () => {
    document.getElementById('modal').style.display = 'none';
};
window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
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

// Suporte para buscar ao apertar "Enter" no teclado do celular
document.getElementById('pesquisa').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('botao-buscar').click();
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

window.addEventListener('DOMContentLoaded', carregarProdutos);