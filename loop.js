import { getChunk } from "./script.js";
import { crate_pessoa } from "./script.js";
import { casas } from "./dados.js";
import { processarIA } from "./ia.js";
import { atualizarTropas } from "./tropas.js";
export let turno = 0;
export function loop(cidades, mundo, player) {
    console.log("Turno passado com sucesso");
    turno++;

    // Executa a inteligência das outras cidades e atualiza exércitos
    processarIA(cidades, player);
    atualizarTropas(cidades);
    let creceu = cidades.find(ctys=> ctys.population.length === 100 );
    if(creceu)creceu.subir_level() ;
    
    // 1. PRIMEIRO: Atualiza as construções (geração de recursos)
    if (player.reino) {
        player.reino.construcoes.forEach((construct) => {
            if (!construct.feito) {
                construct.time_awat--;
                if (construct.time_awat <= 0) {
                    construct.feito = true;
                    console.log(`Construção de ${construct.name} finalizada!`);
                }
            }

            // Se for fazenda e estiver pronta, gera comida no reino
            if (construct.name === "fazenda" && construct.feito) {
                player.reino.comida += 1; // Aumenta a produção para suprir mais pessoas
                console.log(`Fazenda produziu comida! Total: ${player.reino.comida}`);
                player.reino.population.forEach(pes => {
                    if(pes.profissao === "agricultor"){
                        player.reino.comida += 2;
                    }
                });
            }
        });
    }

    // 2. DEPOIS: As cidades consome a comida gerada
    cidades.forEach((element) => {
        element.population.forEach((pes) => {
            pes.idade++;
            element.comida-=0.5; // Consome 1/2 unidade de comida da cidade
            // Se a cidade tiver comida disponível na reserva
            if (element.comida > 0) {
                if (pes.nutricao < 10) {
                    pes.nutricao++; // Eleva a nutrição
                }
                console.log(`${pes.nome} alimentou-se. Comida restante na cidade: ${element.comida}`);
            } else {
                // Fome: Reduz a nutrição se não houver comida
                pes.nutricao--;
                console.log(`${pes.nome} está com fome! Nutrição: ${pes.nutricao}`);
            }

            // Danos por desnutrição
            if (pes.nutricao <= 0) {
                pes.nutricao = 0;
                pes.vida -= 1;
                console.log(`${pes.nome} está sofrendo por desnutrição!`);
            }

            // Morte por velhice
            if (pes.idade > 80) {
                let sort_morte = Math.random();
                if (sort_morte < 0.60) {
                    pes.vida = 0;
                }
            }

            // LÓGICA DE CASAMENTO...
            if (pes.sex === "mulher" && pes.idade > 17 && !pes.conjugue) {
                let marido = element.population.find(men => men.sex === "homem" && men.idade > 17 && !men.conjugue);
                if (marido) {
                    if (pes.casa) {
                        pes.conjugue = marido;
                        marido.conjugue = pes;
                        marido.casa = pes.casa;
                    } else {
                        let name_casa = casas[Math.floor(Math.random() * casas.length)];
                        pes.conjugue = marido;
                        marido.conjugue = pes;
                        marido.casa = name_casa;
                        pes.casa = name_casa;
                        console.log(`A casa de ${pes.casa} foi formada por ${marido.nome} e ${pes.nome}`);
                    }
                }
            }

            // LÓGICA DE REPRODUÇÃO...
            if (pes.sex === "mulher" && pes.nutricao > 3 && pes.conjugue && pes.idade < 60) {
                let chanceGravidez = Math.random();
                if (chanceGravidez < 0.4) {
                    let bebe = crate_pessoa(element, 0);
                    let encontra_bebe = element.population.find(bb => bb === bebe);
                    if (encontra_bebe) {
                        encontra_bebe.pai = pes.conjugue;
                        encontra_bebe.mae = pes;
                        pes.filho = bebe;
                        encontra_bebe.casa = pes.casa;
                        console.log(`${pes.nome} e ${pes.conjugue.nome} tiveram um bebê chamado ${bebe.nome} da casa ${bebe.casa}!`);
                    }
                }
            }
        });

        // Limpa os falecidos da cidade
        element.population = element.population.filter(pes => pes.vida > 0);
    });
}