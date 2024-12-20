import renderPonTournament from "./pongTournament.js";
import { connectToMetaMask, saveToBlockchain } from './blockchain.js';
import { handleRouteChange } from "../mainScript.js";

class TournamentView extends HTMLElement {
    constructor() {
        super();
        this.tournamentData = { name: '', date: new Date().toISOString().split('.')[0], players: [], rounds: [], winner: null, };
        this.currentMatch = null;
        this.currentRoundIndex = 0;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.configsaved = false;
        this.qttplayers = 2;
        this.playeron = false;
    }
    connectedCallback() {
        this.addStyles();
    }
    createFormData(container) {
        const formContainer = document.createElement('div');
        formContainer.id = 'form-container'; // Asignar un ID para manejar la visibilidad
        formContainer.innerHTML = `
        <div class="form-container">
            <h1>Crear Torneo</h1>
            <div style="margin-bottom: 10px;">
                <label for="tournament-name">Nombre del Torneo:</label>
                <input id="tournament-name" type="text" maxlength="13" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 4px;" />
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkSpeed"> Aumentar velocidad con el cono
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkSize"> Disminuir velocidad con el Icosahedron
                </label>
            </div>
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="chkDecrease"> Disminuir velocidad de las palas con el TorusKnot
                </label>
            </div>
            <div style="margin-bottom: 20px;">
                <p>Selecciona la cantidad de jugadores para el torneo:</p>
                <input type="range" id="speedSlider" min="0" max="2" step="1" value="0" style="width: 100%;">
                <span id="sliderValue">4</span>
            </div>
            <button id="btnSave" type="button" style="width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Guardar Configuración</button>
        </div>`;
        // Lógica para el slider
        const slider = formContainer.querySelector('#speedSlider');
        const sliderValue = formContainer.querySelector('#sliderValue');
        const values = [4, 8, 16];
        slider.addEventListener('input', () => {
            const selectedValue = values[slider.value];
            sliderValue.textContent = selectedValue;
            this.qttplayers = selectedValue;
        });
        // Manejo del botón Guardar
        formContainer.querySelector('#btnSave').addEventListener('click', () => {
            const name = formContainer.querySelector('#tournament-name').value;
            if (name) {
                this.tournamentData.name = name;
                this.tournamentData.players = Array.from({ length: this.qttplayers }, (_, i) => `GAMER${i + 1}`);
                if (formContainer.querySelector('#chkSpeed').checked)
                    this.addCustom = true;
                if (formContainer.querySelector('#chkSize').checked)
                    this.addCustom1 = true;
                if (formContainer.querySelector('#chkDecrease').checked)
                    this.addCustom2 = true;
                // Ocultar el formulario y mostrar la vista de edición de jugadores
                formContainer.style.display = 'none';
                this.renderEditPlayersView();
            } else
                alert('Por favor, ingrese un nombre para el torneo.');
        });
        container.appendChild(formContainer);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `.form-container {
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 12px;
            max-width: 400px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .form-container h1 {
            font-size: 1.5rem;
            color: #334155;
            margin-bottom: 1rem;
            text-align: center;
        }
        .form-container label {
            font-size: 1rem;
            color: #475569;
            margin-bottom: 0.5rem;
        }
        .form-container input[type="text"] {
            padding: 10px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 1rem;
            width: 100%;
            background-color: #f1f5f9;
            color: #334155;
        }
        .form-container input[type="checkbox"] {
            margin-right: 10px;
        }
        .form-container input[type="range"] {
            width: 100%;
            margin-top: 5px;
        }
        .form-container span {
            font-size: 1rem;
            color: #475569;
        }
        .form-container button {
            padding: 10px 20px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        .form-container button:hover {
            background-color: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .form-container .slider-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .hidden {
            display: none;
        }
.match {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
	margin-bottom: 2rem;
    padding: 1rem;
    background-color: #e0f2fe; /* Azul claro pastel */
    border-radius: 12px;
    position: relative;
    min-width: 140px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}
.match:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.match span {
    font-size: 1rem;
    margin: 0.5rem 0;
}
.match .winner {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #16a34a; /* Verde para el ganador */
}
.round {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    position: relative;
}
#app{
	display: flex;
}
#tournament-view {
    max-height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 1rem;
}
#bracket {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 1rem; Agregar espacio interno para evitar cortes 
    /*box-sizing: border-box;  Incluir padding en las dimensiones */
}
#tournament-view::-webkit-scrollbar {
    display: none;
}
@media (max-width: 768px) {
    #bracket {
        flex-direction: column;
        gap: 1rem;
    }
}
#edit-players-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0;
	padding: 20px 10px;
    max-height: calc(100vh - 40px); /* Deja algo de espacio para márgenes */
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
    max-height: 80vh; /* Limitar altura máxima */
    overflow-y: auto; /* Habilitar scroll vertical */
    scroll-behavior: smooth; /* Suavizar el desplazamiento */
}
#edit-players-view::-webkit-scrollbar {
    width: 8px; /* Ancho del scroll */
}
#edit-players-view::-webkit-scrollbar-thumb {
    background-color: #3b82f6; /* Color del scroll */
    border-radius: 8px;
}
#edit-players-view h2 {
	margin: 0 0 1rem 0;
    margin-bottom: 1rem;
    color: #334155;
    font-size: 1.5rem;
}
.player-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 1rem;
}
.player-input label {
    font-size: 1rem;
    color: #475569;
    margin-bottom: 0.5rem;
}
.player-input input {
    padding: 10px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
    background-color: #f1f5f9;
    color: #334155;
}
`;
        document.head.appendChild(style);
        if (history.state && history.state.tournamentData) {
            this.tournamentData = history.state.tournamentData;
            console.log('Tournament data loaded:', this.tournamentData);
        } else
            this.createFormData(document.getElementById("app"));
    }
    renderEditPlayersView() {
        this.innerHTML = `<div id="edit-players-view">
            <h2>Editar Jugadores</h2>
            ${this.tournamentData.players.map((player, index) => `
                <div class="player-input">
                    <label for="player-${index}">Jugador ${index + 1}:</label>
                    <input id="player-${index}" data-index="${index}" value="${player}" maxlength="15" />
                </div>
            `).join('')}
            <div id="error-message" style="color: red; display: none;"></div>
            <button id="btnSave" type="button" style="width: 40%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">ACEPTAR</button>
        </div>`;
        this.querySelector('#btnSave').addEventListener('click', () => {
            const inputs = Array.from(this.querySelectorAll('input[data-index]'));
            const playerNames = inputs.map(input => input.value.trim());
            const errorMessageElement = this.querySelector('#error-message');// Validar nombres vacíos
            if (playerNames.some(name => name === "")) {
                errorMessageElement.textContent = 'Todos los jugadores deben tener un nombre.';
                errorMessageElement.style.display = 'block';
                return; // Detener la ejecución si hay campos vacíos
            } // Validar nombres únicos
            const uniqueNames = new Set(playerNames);
            if (uniqueNames.size !== playerNames.length) {
                errorMessageElement.textContent = 'Los nombres de los jugadores deben ser diferentes.';
                errorMessageElement.style.display = 'block';
                return; // Detener la ejecución si hay duplicados
            }// Si no hay errores, ocultar el mensaje de error y continuar
            errorMessageElement.style.display = 'none';
            this.tournamentData.players = playerNames;
            this.initializeTournament();
        });
    }
    initializeTournament() {
        const shuffledPlayers = this.tournamentData.players.sort(() => Math.random() - 0.5);
        this.tournamentData.rounds = [];
        let currentRound = [...shuffledPlayers];
        while (currentRound.length > 1) {
            const nextRound = [];
            const roundMatches = [];
            for (let i = 0; i < currentRound.length; i += 2) {
                const match = {
                    player1: currentRound[i],
                    player2: currentRound[i + 1] || null,
                    winner: null
                };
                roundMatches.push(match);
                nextRound.push(null);
            }
            this.tournamentData.rounds.push(roundMatches);
            currentRound = nextRound;
        }
        this.renderTournamentView();
    }
    updateHistoryState() {
        if (!this.tournamentData.winner)
            history.replaceState({ tournamentData: this.tournamentData }, '', window.location.href);
        else// Elimina el estado del torneo cuando el torneo finaliza
            history.replaceState(null, '', window.location.href);
    }
    resetTournament() {// Remover los datos del torneo de localStorage
        localStorage.removeItem('tournamentData'); // Reiniciar los datos del torneo
        this.tournamentData = { rounds: [], winner: null }; // Limpiar el historial
        history.replaceState({ tournamentData: null }, '', window.location.href); // Renderizar la vista del torneo desde el inicio
        this.renderTournamentView();
    }
    renderTournamentView() {
        if (this.tournamentData.winner) {
            this.renderFinalView();
            return;
        }
        this.innerHTML = `<div id="tournament-view">
            <div id="bracket">
                ${this.tournamentData.rounds.map((round, roundIndex) => `
                    <div class="round">
                        <h3>Ronda ${roundIndex + 1}</h3>
                        ${round.map((match, matchIndex) => `
                            <div class="match">
                                <span>
                                    ${match.player1 || '---'}: ${match.player1_score != null ? match.player1_score : (match.winner ? 0 : '_')} vs 
                                    ${match.player2 || '---'}: ${match.player2_score != null ? match.player2_score : (match.winner ? 0 : '_')}
                                </span>
                                ${match.winner ? `
                                    <span>Ganador: ${match.winner}</span>` : `
                                    <button 
                                        class="start-match" 
                                        data-round-index="${roundIndex}" 
                                        data-match-index="${matchIndex}"
                                        ${this.currentMatch || !match.player1 || !match.player2 ? 'disabled' : ''}> 
                                        Jugar
                                    </button>`}
                            </div>`).join('')}
                    </div>`).join('')}
            </div>
            <div id="game-container"></div>
        </div>`;
        const buttons = this.querySelectorAll('.start-match');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                buttons.forEach(btn => btn.disabled = true);
                const roundIndex = parseInt(button.dataset.roundIndex, 10);
                const matchIndex = parseInt(button.dataset.matchIndex, 10);
                const match = this.tournamentData.rounds[roundIndex][matchIndex];
                this.currentMatch = match;// Iniciar el juego y recibir puntajes
                this.startMatch(match.player1, match.player2, (winner, player1Score, player2Score) => {
                    match.winner = winner;
                    match.player1_score = player1Score;
                    match.player2_score = player2Score;
                    if (roundIndex + 1 < this.tournamentData.rounds.length) {
                        const nextMatchIndex = Math.floor(matchIndex / 2);
                        this.tournamentData.rounds[roundIndex + 1][nextMatchIndex][matchIndex % 2 === 0 ? 'player1' : 'player2'] = winner;
                    } else {
                        this.tournamentData.winner = winner;
                        buttons.forEach(btn => btn.disabled = false);
                    }
                    this.currentMatch = null;
                    this.updateHistoryState();
                    this.renderTournamentView();
                });
            });
        });
        // window.addEventListener('popstate', (event) => {
        //     if (event.state && event.state.tournamentData) {
        //         this.tournamentData = event.state.tournamentData;
        //         this.renderTournamentView();
        //     } else {// Si el estado es null, significa que el historial fue limpiado o restablecido
        //         this.tournamentData = { rounds: [], winner: null };
        //         this.renderTournamentView();
        //     }
        // });
    }
    async save_tournament() {
        try {
            const payload = {
                name: this.tournamentData.name, // Nombre del torneo
                date: this.tournamentData.date, // Fecha del torneo
                players: this.tournamentData.players.map(player => player), // Lista de nombres de jugadores
                rounds: this.tournamentData.rounds.map(round =>
                    round.map(match => ({
                        player1: match.player1, // Nombre del jugador 1
                        player2: match.player2, // Nombre del jugador 2
                        player1_score: match.player1_score, // Puntuación del jugador 1
                        player2_score: match.player2_score, // Puntuación del jugador 2
                        winner: match.winner // Nombre del ganador
                    }))),
                winner: this.tournamentData.winner // Nombre del ganador del torneo
            };
            console.log('Payload enviado:', payload);
            const response = await fetch('http://127.0.0.1:8001/api/tournaments/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), });
            if (!response.ok) {
                console.error('Error al guardar el ganador:', response.statusText);
                alert('No se pudo guardar el ganador.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al conectarse con el servidor.');
        }
    }
    renderFinalView() {
        this.innerHTML = `<div id="tournament-final-view">
                <div id="bracket">${this.generateBracketHTML()}</div>
                <div id="winner">
                    <h2>¡Ganador del Torneo!</h2>
                    <p>${this.tournamentData.winner}</p>
                    <button id="save-winner">Guardar y salir</button>
                    <button id="exit">Salir</button>
                </div>
            </div>`;
        this.save_tournament();
        history.replaceState(null, '', window.location.href);
        document.querySelector('#save-winner').addEventListener('click', async () => {
            const connected = await connectToMetaMask();
            if (!connected) return;
            await saveToBlockchain(this.tournamentData.name, this.tournamentData.date, this.tournamentData.winner);
        });
        document.querySelector('#exit').addEventListener('click', async () => {
            history.pushState('', '', '/Profile');
            handleRouteChange();
            const appElement = document.getElementById('app');//appElement.style.display = 'block';
        });
    }
    startMatch(player1, player2, onGameEnd) {
        const brackets = this.querySelector('#bracket');
        brackets.innerHTML = '';
        const gameContainer = this.querySelector('#game-container');
        this.playeron = true;
        const pongGame = renderPonTournament(this.currentMatch, this.currentRoundIndex, this.lastSelect, this.addCustom,
            this.addCustom1, this.addCustom2, player1, player2, (winner, player1Score, player2Score) => { // Callback al terminar el juego
                onGameEnd(winner, player1Score, player2Score);
            });
        this.playeron = false;
        gameContainer.innerHTML = '';
        this.updateHistoryState();
        gameContainer.appendChild(pongGame);
    }
    generateBracketHTML() {
        return this.tournamentData.rounds.map((round, roundIndex) => `
            <div class="round">
                <h3>Ronda ${roundIndex + 1}</h3>
                <div class="matches">
                    ${round.map(match => `
                        <div class="match">
                             <span>${match.player1}: ${match.player1_score} vs ${match.player2}: ${match.player2_score}</span>
                            ${match.winner ? `<div class="winner">Ganador: ${match.winner}</div>` : ''}
                        </div>`).join('')}
                </div>
            </div>`).join('');
    }
}
customElements.define('tournament-view', TournamentView);
export default function renderTournamentApp() { return '<tournament-view></tournament-view>'; }
