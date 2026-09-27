//MÓDULO ONDE FICA O MEU LOOOOOOOP PRINCIPAL PARA O TURNO.
import {recursos} from "./dados.js";
import{loop,turno} from "./loop.js";
import { creatFirt_citys } from "./funtions_classes.js";
import { atualizar_painel } from "./funtions_classes.js";
import { tecno_decizions,tecno_pesquisando } from "./tecnologia.js";
//OBJETO QUE CUIDA DAS AÇÕES DO PLAYER.
export let player = {
 jogando:false,reino:null
};
//DADOS PARA SEREM USADOS NO JOGO.
export let cidades_nomes = [
  "Aldeaforte", "Arboris", "Baluarte", "Belamira", "Bravonor",
  "Cantamaria", "Colina-do-Corvo", "Dornália", "Eldória", "Ferroburgo",
  "Fim-da-Terra", "Fontesbela", "Galart", "Ice-Eterno", "Luz-da-Manhã",
  "Mar-da-Torre", "Miravale", "Montenor", "Névoa-Profunda", "Oásis-Oculto",
  "Pedra-Rachada", "Porto-Luz", "Pousada-do-Rei", "Rocha-Negra", "Santuário",
  "Solária", "Valverde", "Valenor", "Vento-Uivante", "Vila-do-Trigo",
  "Gerundia","Walestmendland","Yorkut","MagnusTedLand","Strongglen", "Arboris", "Bulwark", "Fairlook", "Bravenore",
  "Singingstead", "Raven-Hill", "Dornalia", "Eldoria", "Ironburg",
  "Land's-End", "Fairspring", "Galelore", "Everfrost", "Morn-Light",
  "Tower-Mar", "Miravale", "Northmount", "Deepmist", "Hidden-Oasis",
  "Split-Stone", "Lightport", "King's-Rest", "Blackrock", "Sanctuary",
  "Solaria", "Greenvale", "Valenore", "Howling-Wind", "Wheat-Village"
];
let pessoas_nomes =["Zelphir", "Xandri", "Vrylan", "Quoril", "Phreya",
  "Nymis", "Mrazo", "Kryla", "Jovik", "Grypha",
  "Frazon", "Drazel", "Cthona", "Blythos", "Azgar",
  "Tshula", "Skarin", "Ryzan", "Pshoka", "Onyris",
  "Nzila", "Klyven", "Hzona", "Gvoldo", "Fwipa",
  "Dzhani", "Crayle", "Bvoshi", "Alzhir", "Znytha",
  "Kragor", "Vlorken", "Thruum", "Skragne", "Rjokan",
  "Pzuhli", "Okhzan", "Ngarth", "Mzokan", "Kzhad",
  "Jorzk", "Gralkor", "Frazk", "Dzhur", "Crazg",
  "Brakzon", "Azhgar", "Zgrod", "Xkaron", "Vrakon",
  "Tzkor", "Skozh", "Raxzel", "Pkhon", "Ozhmar",
  "Nzorg", "Kralz", "Gzorn", "Fvold", "Drzko"
]
const imgAgua = new Image(); 
const imgTerra = new Image(); 
const imgMontanha = new Image(); 

let imagensCarregadas = 0;

function verificarEIniciar() {
    imagensCarregadas++;
    // Só renderiza tudo quando as 3 imagens estiverem 100% prontas
    if (imagensCarregadas === 3) {
        render_world();
    }
}

imgAgua.onload = verificarEIniciar;
imgTerra.onload = verificarEIniciar;
imgMontanha.onload = verificarEIniciar;

imgAgua.src = "img/agua.png";
imgTerra.src = "img/terra.png";
imgMontanha.src = "img/montanha.png";
export let cidades = [];
//COISAS HTML
let canva = document.createElement("canvas");
let painel_bt = document.getElementById("dados");
let painel = document.getElementById("painel");
let sala_ctrl_bt = document.getElementById("bt_ctrls");
let bt_start = document.getElementById("start");
let bt_turno = document.getElementById("turno");
let bt_sair_map = document.getElementById("sair_do_mapa");
let bt_tecnologia = document.getElementById("tecnologia");
let sala_tecno = document.getElementById("teia_tec");
canva.width = 900;
canva.height = 900;
let CELL = 30;
let game_div = document.getElementById("game");
game_div.appendChild(canva);
let ctx = canva.getContext("2d");
ctx.imageSmoothingEnabled = false;
//FUNÇÃO QUE ENCONTRA COISAS NO MUNDO.
export function getChunk(X,Y){
    let chunk_encontada = mundo.find(chk => chk.id_X === X && chk.id_Y === Y &&
        chk.type === "Solo" && !chk.ocupada
    );
    return chunk_encontada;
};
//FUNÇÃO QUE CRIA PESSOAS.
export function crate_pessoa(city,random_age){
    let random_name = pessoas_nomes[Math.floor(Math.random()*pessoas_nomes.length)];
        let random_chose = Math.floor(Math.random()*2)+1;
        let sex;
        if(random_chose == 2){sex ="homem";}
        else{sex = "mulher";};
        let profissoes_posible =["carpinteiro","mineiro","agricultor"];
        let random_profissao = profissoes_posible[Math.floor(Math.random()*profissoes_posible.length)];
        let pessoa = new Pessoa(random_name,random_age,sex,city.name);
        pessoa.profissao = random_profissao;
        city.population.push(pessoa);

        return pessoa;
}
//FUNÇÃO QUE CRIA AS PRIMEIRAS CIDADES DO MUNDO.

//O UM PEQUENO MUNDO ONDE REIS DERRAMARÃO RIOS DE SANGUE PARA CONQUISTAR, APENAS UM OBJETO.
let mundo = [];
//OQUE DELIMITA UMA CIDADE, COISINHAS IMAGINARIAS PELAS QUAIS OS HUMANOS DARÃO SUAS VIDAS PARA PROTEJER. 
class Fronteira{
    constructor(id_X,id_Y){
        this.id_X = id_X;
        this.id_Y = id_Y;
        this.city_pertence = null;
        this.recursos_front =[];
    }
}
//CLASS QUE CRIA asS PEOPLES.
 class Pessoa{
    constructor(nome,idade,sex,cidade){
        this.nome = nome;
        this.idade = idade;
        this.sex = sex;
        this.cidade = cidade;
        this.conjugue = null;
        this.nutricao = 10;
        this.vida = 10;
        this.profissao = null;
        //propriedades de familia.
        this.pai = null;
        this.mae = null;
        this.casa =null;
        this.filho = null;
    }
 }
//CRIAÇÃO DA CLASS QUE PRENCHERÁ O MUNDOOOOOO!
class Chunk{
    constructor(cell,id_X,id_Y,type){
        this.cell = cell;
        this.id_X = id_X;
        this.id_Y = id_Y;
        this.ocupada = false;
        this.space = null;
        this.type = type;
        this.recursos = null;
    }
    draw() {
    if (this.type === "Water") {
        ctx.drawImage(imgAgua, this.id_X, this.id_Y, this.cell, this.cell);
    } else if (this.type === "Mountain") {
        ctx.drawImage(imgMontanha, this.id_X, this.id_Y, this.cell, this.cell);
    } else if (this.type === "Solo") {
        ctx.drawImage(imgTerra, this.id_X, this.id_Y, this.cell, this.cell);
    }
}
};
//CLASSE DE CIDADE
export class City{
    constructor(id_X,id_Y,name,color){
        this.id_X = id_X;
        this.id_Y = id_Y;
        this.name = name;
        this.dominos_fronteiras =[];
        this.population = [];
        this.governante = null;
        this.recursos =[];
        this.recursos_usaveis = [];
        this.construcoes =[];
        this.tecnologia =[];
        this.level = 1;
        this.player = false;
        this.color = color;
        this.fronteira = 1;
        this.cultura = null;
        this.limite_construct = 10;
        this.comida = 0;
    }
    //MÉTODO RESPONSAVEL POR DESENHAR AS FRONTEIRAS DO MUNDO.
    draw_dominio(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.id_X,this.id_Y,CELL,CELL);
        let raioFronteiaX = this.id_X + this.fronteira*CELL;
        let raioFronteiaY = this.id_Y + this.fronteira*CELL;
        let raioFronteiaXsul = this.id_X - this.fronteira*CELL;
        let raioFronteiaYnort = this.id_Y - this.fronteira*CELL;
        for(let x = raioFronteiaXsul; x <= raioFronteiaX; x += CELL){
            for(let y = raioFronteiaYnort; y <= raioFronteiaY; y += CELL){
                let front_destino = getChunk(x,y);
                if(front_destino &&!front_destino.ocupada && front_destino.type === "Solo" ){
                    ctx.fillRect(x,y,CELL,CELL);
                    let fronteira_nova = new Fronteira(x,y);
                    if(front_destino.recursos){
                        this.recursos.push(front_destino.recursos);
                        front_destino.recursos = null;
                    };
                    front_destino.space = fronteira_nova;
                    front_destino.ocupada = true;
                    this.dominos_fronteiras.push(fronteira_nova);
                }
            }
        }
        
    }
    subir_level(){
        this.fronteira++;
        this.level++;
        this.limite_construct+=5;
        this.draw_dominio();
    }
//FIM DA CLASS CITY.
}
//FUNÇÃO QUE PRENCHE O UNIVERSOOOO!!!
function render_world(){
    for(let x = 0; x < canva.width; x += CELL){
        for(let y = 0; y < canva.height; y+= CELL){
            let sorteio = Math.random();
            let element_relevo;
            //SORTEIA O RELEVO PRESENTE NAQUELA CHUNK.
            if (sorteio < 0.60) {
                element_relevo = "Solo"; 
            } else if (sorteio < 0.80) {
                element_relevo = "Mountain"; 
            } else {
                element_relevo = "Water";  
            }
            let chunk = new Chunk(CELL,x,y,element_relevo);
            mundo.push(chunk);
            //SORTEIA SE TERARÁ UMA CIDADE INICIAL NESSA CHUNK OU NÃO
            let rand_city_become = Math.floor(Math.random()*1000)+1;
            if(rand_city_become < 10 && chunk.type === "Solo"){
                creatFirt_citys(x,y,cidades);
            };
            //SORTEIA SE TERÁ UM RECURSO NESSA CHUNK.
            if(rand_city_become > 900 && chunk.type === "Solo"){
                let rec = recursos[Math.floor(Math.random()*recursos.length)];
                chunk.recursos = rec;
                
            };
            
        };
    };
    console.log(mundo.length);
    mundo.forEach((chk)=>{
        chk.draw();
    });
    cidades.forEach((cyt)=>{
        cyt.draw_dominio();
    });

};
//ENTIDADES CLASS.
bt_start.addEventListener("click",()=>{
    if(selecao){
    bt_start.style.display ="none";
    sala_ctrl_bt.style.display ="block";
    player.reino = selecao;
    console.log("Você está jogando com o reino de "+player.reino.name+" boa sorte!");
    }
        
});
//CAPTURA O CLICK NO CANVAS.
let selecao;
canva.addEventListener("click",(e)=>{
    if(!player.jogando){
    let rect = canva.getBoundingClientRect();
    
    // Calcula X e Y exatos dentro do Canvas
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;

    // Arredonda para o múltiplo de 30px mais próximo
    let gridX = Math.floor(clickX / CELL) * CELL;
    let gridY = Math.floor(clickY / CELL) * CELL;

    // Procura se existe uma cidade nessa coordenada
    let Cidade_encontrada_select = cidades.find(c => c.id_X === gridX && c.id_Y === gridY);
    if(Cidade_encontrada_select){
        selecao = Cidade_encontrada_select;
        let selecit_explan = document.getElementById("select_city");
        selecit_explan.innerHTML = "Você selecionou a cidede de "+selecao.name+" confirme em START!";
        selecit_explan.style.color = "blue";
    }
    else {
            console.log("Nenhuma cidade selecionada nesse local.");
        }
    }
});
//BOTÃO DE PASSAR O TURNO, ONDE O LOOP DO JOGO VIVE.
bt_turno.addEventListener("click",()=>{
    loop(cidades,mundo,player);
    if(player.reino){
    atualizar_painel(game_div);
    tecno_decizions(game_div,sala_tecno,player);
    };
});
//ENTRA NA ARÉA DE ANALISE DE DADOS E TOMADA DE DECISÕES.

//abre o painel.
painel_bt.addEventListener("click",()=>{
    game_div.style.display ="none";
    painel.style.display ="block";
     sala_tecno.style.display = "none";
    atualizar_painel(game_div);
    
})
//BOTÃO QUE LEVA PARA A SALA DA TECNOLOGIA, A ALMA DA HUMANIDADE.
bt_tecnologia.addEventListener("click",()=>{
    game_div.style.display = "none";
    painel.style.display ="none";
    sala_tecno.style.display = "block";
})



