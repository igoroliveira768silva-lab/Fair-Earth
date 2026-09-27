// tropas.js

export class Tropa {
    constructor(tipo, ataque, defesa, custoComida, reino) {
        this.tipo = tipo;           // ex: "Recruta", "Arqueiro", "Cavaleiro"
        this.ataque = ataque;
        this.defesa = defesa;
        this.custoComida = custoComida; // Consumo de comida por turno
        this.reino = reino;
        this.posicaoX = reino ? reino.id_X : 0;
        this.posicaoY = reino ? reino.id_Y : 0;
    }
}

// Tipos de tropas disponíveis para recrutamento
export const tiposDeTropas = [
    { tipo: "Recruta", ataque: 5, defesa: 5, custoComida: 1, tecno: "cultivo" },
    { tipo: "Arqueiro", ataque: 12, defesa: 4, custoComida: 2, tecno: "mineração" },
    { tipo: "Cavaleiro", ataque: 20, defesa: 15, custoComida: 4, tecno: "estrativismo" }
];

// Recruta uma nova tropa para o reino se houver recursos e tecnologia necessária
export function recrutarTropa(player, tipoNome) {
    let tipoTropa = tiposDeTropas.find(t => t.tipo === tipoNome);
    if (!tipoTropa) return alert("Tipo de tropa inválido!");

    // Checa se possui a tecnologia necessária
    let temTec = player.reino.tecnologia.some(t => t.nome === tipoTropa.tecno && t.feito);
    if (!temTec) {
        return alert(`Você precisa da tecnologia '${tipoTropa.tecno}' para recrutar ${tipoNome}!`);
    }

    // Checa se há população disponível
    if (player.reino.population.length <= 1) {
        return alert("População insuficiente para recrutar soldados!");
    }

    // Consome 1 cidadão para virar soldado
    player.reino.population.pop();

    if (!player.reino.tropas) {
        player.reino.tropas = [];
    }

    let novaTropa = new Tropa(tipoTropa.tipo, tipoTropa.ataque, tipoTropa.defesa, tipoTropa.custoComida, player.reino);
    player.reino.tropas.push(novaTropa);
    
    console.log(`Unidade de ${tipoNome} recrutada com sucesso! Total de tropas: ${player.reino.tropas.length}`);
}

// Processa o consumo de comida das tropas no final do turno
export function atualizarTropas(cidades) {
    cidades.forEach(cidade => {
        if (cidade.tropas && cidade.tropas.length > 0) {
            let consumoTotal = cidade.tropas.reduce((sum, t) => sum + t.custoComida, 0);
            
            if (cidade.comida >= consumoTotal) {
                cidade.comida -= consumoTotal;
            } else {
                // Fome nas tropas: desertam algumas unidades se faltar comida
                cidade.tropas.pop();
                console.log(`Falta de suprimentos em ${cidade.name}! Uma unidade de tropas desertou.`);
            }
        }
    });
}