// ia.js
import { tecnologias } from "./dados.js";

export function processarIA(cidades, player) {
    cidades.forEach(cidade => {
        // Ignora a cidade controlada pelo jogador
        if (player.reino && cidade.name === player.reino.name) return;

        // 1. TOMADA DE DECISÃO DE TECNOLOGIA
        if (!cidade.tecnologia) cidade.tecnologia = [];

        // IA tenta pesquisar Cultivo -> Mineração -> Estrativismo na ordem
        let cultivo = cidade.tecnologia.find(t => t.nome === "cultivo");
        let mineracao = cidade.tecnologia.find(t => t.nome === "mineração");
        let estrativismo = cidade.tecnologia.find(t => t.nome === "estrativismo");

        if (!cultivo) {
            cidade.tecnologia.push({ ...tecnologias[0], feito: true }); // Conclui cultivo
            console.log(`IA [${cidade.name}] pesquisou Cultivo.`);
        } else if (!mineracao) {
            cidade.tecnologia.push({ ...tecnologias[1], feito: true }); // Conclui mineração
            console.log(`IA [${cidade.name}] pesquisou Mineração.`);
        } else if (!estrativismo) {
            cidade.tecnologia.push({ ...tecnologias[2], feito: true }); // Conclui estrativismo
            console.log(`IA [${cidade.name}] pesquisou Estrativismo.`);
        }

        // 2. TOMADA DE DECISÃO DE CONSTRUÇÃO
        if (!cidade.construcoes) cidade.construcoes = [];

        // Se estiver com pouca comida e tiver limite de construção, cria Fazenda
        if (cidade.comida < 10 && cidade.limite_construct > 0) {
            cidade.construcoes.push({ name: "fazenda", time_awat: 0, tecno: "cultivo", feito: true });
            cidade.comida += 5; // Aumenta reserva
            cidade.limite_construct--;
            console.log(`IA [${cidade.name}] construiu uma Fazenda para evitar escassez.`);
        }
    });
}