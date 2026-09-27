import { tecnologias } from "./dados.js";

// Armazena a tecnologia que está sendo pesquisada no momento
export let tecno_pesquisando = null;

export function tecno_decizions(div_game, sala_tec, player) {
    let msm = document.getElementById("msm_tec");
    if (msm) {
        msm.remove();
    }

    // 1. GERENCIAMENTO DO TURNO DE PESQUISA
    if (tecno_pesquisando) {
        tecno_pesquisando.tempo_await--;

        // Conclui a pesquisa atual quando chega a 0
        if (tecno_pesquisando.tempo_await <= 0) {
            tecno_pesquisando.tempo_await = 0;
            tecno_pesquisando.feito = true;
            console.log(`Sua pesquisa acerca de ${tecno_pesquisando.nome} foi finalizada com sucesso!`);
            tecno_pesquisando = null; // Libera a fila para a próxima tecnologia
        }
    }

    // 2. REFERÊNCIAS DO DOM
    const cultivo_bt = document.getElementById("tec-cultivo");
    const button_tec_mineracao = document.getElementById("tec-mineracao");
    const button_tec_estrativismo = document.getElementById("tec-estrativismo");
    const canvas = document.getElementById("tec-canvas");

    canvas.width = sala_tec.clientWidth || 300;
    canvas.height = sala_tec.clientHeight || 400;

    // FECHAR A TELA
    document.getElementById("voltar_tec").onclick = () => {
        sala_tec.style.display = "none";
        div_game.style.display = "block";
    };

    // 3. PIPELINE VISUAL (Atualiza cores e libera botões no HTML)
    
    // ESTADO: Cultivo
    let cultivo = player.reino.tecnologia.find(t => t.nome === "cultivo");
    if (cultivo && cultivo.feito) {
        cultivo_bt.style.backgroundColor = "green";
        button_tec_mineracao.style.display = "inline-block"; // Revela Mineração
    }

    // ESTADO: Mineração
    let mineracao = player.reino.tecnologia.find(t => t.nome === "mineração");
    if (mineracao && mineracao.feito) {
        button_tec_mineracao.style.backgroundColor = "green";
        button_tec_estrativismo.style.display = "inline-block"; // Revela Estrativismo
    }

    // ESTADO: Estrativismo
    let estrativismo = player.reino.tecnologia.find(t => t.nome === "estrativismo");
    if (estrativismo && estrativismo.feito) {
        button_tec_estrativismo.style.backgroundColor = "green";
    }

    // 4. EVENTOS DE CLIQUE (Atribuição com onclick para evitar duplicação de listeners)
    
    // Clique em Cultivo
    cultivo_bt.onclick = () => {
        if (player.reino.tecnologia.length === 0 && !tecno_pesquisando) {
            alert(`cultivo será pesquisado em ${tecnologias[0].tempo_await} turnos`);
            let nova_tec = { ...tecnologias[0] };
            player.reino.tecnologia.push(nova_tec);
            tecno_pesquisando = nova_tec;
            console.log("Você está pesquisando sobre Cultivo. Demorará " + nova_tec.tempo_await + " turnos.");
        }
    };

    // Clique em Mineração
    button_tec_mineracao.onclick = () => {
        let ja_tem_mineracao = player.reino.tecnologia.some(t => t.nome === "mineração");
        if (cultivo && cultivo.feito && !ja_tem_mineracao && !tecno_pesquisando) {
            alert(`mineração será pesquisado em ${tecnologias[1].tempo_await} turnos`);
            let nova_tec = { ...tecnologias[1] };
            player.reino.tecnologia.push(nova_tec);
            tecno_pesquisando = nova_tec;
            console.log("Você está pesquisando sobre Mineração. Demorará " + nova_tec.tempo_await + " turnos.");
        }
    };

    // Clique em Estrativismo
    button_tec_estrativismo.onclick = () => {
        let ja_tem_estrativismo = player.reino.tecnologia.some(t => t.nome === "estrativismo");
        // Supondo que a tecnologia de estrativismo seja a 3ª do seu arquivo dados.js (index 2)
        if (mineracao && mineracao.feito && !ja_tem_estrativismo && !tecno_pesquisando) {
            alert(`estrativismo será pesquisado em ${tecnologias[2].tempo_await} turnos`);
            let nova_tec = { ...tecnologias[2] }; 
            player.reino.tecnologia.push(nova_tec);
            tecno_pesquisando = nova_tec;
            console.log("Você está pesquisando sobre Estrativismo. Demorará " + nova_tec.tempo_await + " turnos.");
        }
    };
}