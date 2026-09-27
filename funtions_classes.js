import { player } from "./script.js";
import { cidades_nomes } from "./script.js";
import { getChunk } from "./script.js";
import { crate_pessoa } from "./script.js";
import { City } from "./script.js";
import { recrutarTropa } from "./tropas.js";
import { construcoes } from "./dados.js";

// Função que atualiza o painel principal
export function atualizar_painel(game_div){

    let totalTropas = player.reino.tropas ? player.reino.tropas.length : 0;
let spanTropas = document.getElementById("total_tropas");
if (spanTropas) spanTropas.innerText = totalTropas;

document.getElementById("recrut_recruta")?.addEventListener("click", () => {
    recrutarTropa(player, "Recruta");
    atualizar_painel(game_div);
});
document.getElementById("recrut_arqueiro")?.addEventListener("click", () => {
    recrutarTropa(player, "Arqueiro");
    atualizar_painel(game_div);
});
document.getElementById("recrut_cavaleiro")?.addEventListener("click", () => {
    recrutarTropa(player, "Cavaleiro");
    atualizar_painel(game_div);
});
    let limit_constructor = player.reino.limite_construct;
    
    // Contagem de recursos no inventário do reino
    let ouro = player.reino.recursos.filter(our => our.type === "ouro");
    let ferro = player.reino.recursos.filter(our => our.type === "ferro");
    let cobre = player.reino.recursos.filter(our => our.type === "cobre");
    let madeira = player.reino.recursos.filter(our => our.type === "madeira");

    // Preenche o HTML do painel
    painel.innerHTML = `
      <button id="fechar_painel" style="float: right;">✖ Voltar ao Mapa</button>
      <h2 id="nome_cidade">${player.reino.name}</h2>
      <h2>Governante: ${player.reino.governante ? player.reino.governante.nome : "Sem Rei"}</h2>
      <p id="status_cidade">Nível: ${player.reino.level} | População: ${player.reino.population.length}</p>
      
      <div class="secao_painel">
        <h3>Recursos</h3>
        <p>Comida: <span id="res_comida">${player.reino.comida}</span></p>
        <p>Madeira: <span id="res_madeira">${madeira.length}</span></p>
        <p>Ouro: <span id="res_ouro">${ouro.length}</span></p>
        <p>Ferro: <span id="res_ferro">${ferro.length}</span></p>
        <p>Cobre: <span id="res_cobre">${cobre.length}</span></p>
      </div>

      <div id="secao_painel_producao">
        <h3>Decisões / Foco de Produção</h3>
        <button id="foco_comida"><img src="img/fazenda.png">Construir Fazenda</button>
        <button id="foco_madeira">Construir Serraria</button>
        <button id="foco_ouro">Construir Mina de Ouro</button>
      </div>

      <div id="informacao_product" style="display:none; border:1px solid #ccc; padding:10px; margin-top:10px;"></div>

      <div class="secao_painel">
        <h3>Cidadãos e Casas</h3>
        <button id="lista_cidadaos">Cidadãos</button>
        <div id="container_cidadaos"></div>
      </div>
      <div id="secao_painel_militar" style="margin-top: 15px;">
    <h3>Quartel / Exército</h3>
    <button id="recrut_recruta">Recrutar Recruta</button>
    <button id="recrut_arqueiro">Recrutar Arqueiro</button>
    <button id="recrut_cavaleiro">Recrutar Cavaleiro</button>
    <p>Tropas Atuais: <span id="total_tropas">0</span></p>
</div>
    `;
    //função que questina a existencia da tecnologia modular, e as vezes do cosmos.
    function temTecnologia(nomeTec) {
        return player.reino.tecnologia.some(tec => tec.nome === nomeTec && tec.feito);
    }
    // Função interna para processar construções
    function buscar_construcao(tipo){
        if (player.reino.limite_construct <= 0) {
            alert("Limite de construções atingido!");
            return;
        }

        if (tipo === "fazenda") {
            //verfica tecnologia adquerida.
            if (!temTecnologia("cultivo")) {
            alert("Você precisa pesquisar a tecnologia 'Cultivo' antes de construir uma Fazenda!");
            return;
            }
            //se passa é true.
            player.reino.construcoes.push({ name: "fazenda", time_awat: 5, tecno: "cultivo", feito: false });
            player.reino.limite_construct--;
        } 
        else if (tipo === "cerraria") {
            //verfica tecnologia adquerida.
            if (!temTecnologia("estrativismo")) {
            alert("Você precisa pesquisar a tecnologia 'Estrativismo' antes de construir uma Serraria!");
            return;
            }
            //se passa é true.
            // Verifica se possui madeira disponível nas reservas/recursos
            let temMadeira = player.reino.recursos.some(r => r.type === "madeira");
            if (temMadeira || true) { // Permitido construir serraria
                player.reino.construcoes.push({ name: "cerraria", time_awat: 5, tecno: "estrativismo", feito: false });
                player.reino.limite_construct--;
            }
        } 
        else if (tipo === "mina-ouro") {
            if (!temTecnologia("mineração")) {
                alert("Você precisa pesquisar a tecnologia 'Mineração' antes de construir uma Mina de Ouro!");
                return;
            }
            // Verifica se há jazida de ouro no território do reino
            let temOuro = player.reino.recursos.some(r => r.type === "ouro");
            if (temOuro) {
                player.reino.construcoes.push({ name: "mina de ouro", time_awat: 5, tecno: "mineração", feito: false });
                player.reino.limite_construct--;
            } else {
                alert("Você precisa de uma jazida de ouro no território do reino para construir uma mina!");
            }
        }
    }

    // Atualiza a caixa visual de construções em andamento
    function renderizar_status_construcoes() {
        let infoDiv = document.getElementById("informacao_product");
        infoDiv.style.display = "block";

        let html = `<h2>Suas construções</h2>
                    <button id="sair_construct" style="float:right;">X</button>
                    <p>Limite restante: ${player.reino.limite_construct}</p><ul>`;

        player.reino.construcoes.forEach((constr, index) => {
            let estado = constr.feito ? "pronta" : `em andamento (${constr.time_awat} turnos)`;
            html += `<li><strong>${constr.name}</strong> #${index + 1}: ${estado}</li>`;
        });

        html += `</ul>`;
        infoDiv.innerHTML = html;

        // Botão para fechar o subpainel de construções
        document.getElementById("sair_construct").addEventListener("click", () => {
            infoDiv.style.display = "none";
        });
    }

    // Eventos dos Botões de Construção
    document.getElementById("foco_comida").addEventListener("click", () => {
        buscar_construcao("fazenda");
        renderizar_status_construcoes();
    });

    document.getElementById("foco_madeira").addEventListener("click", () => {
        buscar_construcao("cerraria");
        renderizar_status_construcoes();
    });

    document.getElementById("foco_ouro").addEventListener("click", () => {
        buscar_construcao("mina-ouro");
        renderizar_status_construcoes();
    });

    // Fechar o Painel Geral e voltar ao mapa
    document.getElementById("fechar_painel").addEventListener("click", () => {
        painel.style.display = "none";
        game_div.style.display = "block";
    });

    // Lista de Cidadãos
    document.getElementById("lista_cidadaos").addEventListener("click", () => {
        let container = document.getElementById("container_cidadaos");
        container.innerHTML = ""; 
        
        let ul = document.createElement("ul");
        player.reino.population.forEach(pes => {
            let li = document.createElement("li");
            let infoCasa = pes.casa ? ` [Casa ${pes.casa}]` : "";
            let infoConjuge = pes.conjugue ? ` - Casado(a) com ${pes.conjugue.nome}` : " - Solteiro(a)";
            li.innerText = `${pes.nome}${infoCasa} (${pes.idade} anos, ${pes.sex}) - Profissão: ${pes.profissao}${infoConjuge}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    });
}

// Função que cria as cidades iniciais
export function creatFirt_citys(x, y, cidades) {
    let name_city = cidades_nomes[Math.floor(Math.random() * cidades_nomes.length)];
    let colors_posibles = [
      "rgba(230, 57, 70, 0.4)",   "rgba(241, 196, 15, 0.4)",  "rgba(155, 89, 182, 0.4)",  
      "rgba(230, 126, 34, 0.4)",  "rgba(26, 188, 156, 0.4)",  "rgba(233, 30, 99, 0.4)",   
      "rgba(52, 73, 94, 0.4)",    "rgba(142, 68, 173, 0.4)",  "rgba(211, 84, 0, 0.4)",    
      "rgba(127, 140, 141, 0.4)"
    ];
    let color_chosen = colors_posibles[Math.floor(Math.random() * colors_posibles.length)];
    let localDeFundacao = getChunk(x, y);
    let city = new City(x, y, name_city, color_chosen);

    for (let i = 0; i < 5; i++) {
        let random_age = Math.floor(Math.random() * 40) + 1;
        crate_pessoa(city, random_age);
    }

    let King = crate_pessoa(city, 20);
    King.profissao = "Ruler";
    city.governante = King;

    if (localDeFundacao) {
        localDeFundacao.space = city;
        localDeFundacao.ocupada = true;
    }

    cidades.push(city);
    console.log(`A cidade de ${city.name} foi fundada em X:${x} Y:${y}.`);
}