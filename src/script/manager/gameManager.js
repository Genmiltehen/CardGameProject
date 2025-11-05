import { _v } from "../libs/_v.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { PlayerFighter } from "../player/playerFighter.js";
import { CardEventSystem, createGameEvent } from "./eventSystem.js";
import { GameBoard } from "./gameBoard.js";
import { UIManager } from "./uiManager.js";

const BOARD_SIZE = new boardPos(6, 2);

export class GameManager {
	/** @type {?UIManager} */
	#uiManager;
	/** @type {GameBoard} */
	gameBoard;
	/** @type {CardEventSystem} */
	eventSystem;

	/** @type {PlayerFighter} */
	player;

	/** @type {GameState} */
	state;

	/**
	 * @param {PlayerData} playerData
	 */
	constructor(playerData) {
		methodBind(this, "ev");
		this.gameBoard = new GameBoard(this, BOARD_SIZE);
		this.eventSystem = new CardEventSystem();
		this.#uiManager = null;

		this.state = "NONE";

		this.player = new PlayerFighter(this, playerData);

		this.#setupEvents();
	}

	/**
	 * @readonly
	 * @type {UIManager}
	 */
	get uiManager() {
		if (this.#uiManager == null) throw new Error("UIManager is not bound");
		return this.#uiManager;
	}

	/** @param {UIManager} uiManager */
	bindUIManager(uiManager) {
		this.#uiManager = uiManager;
		this.#uiManager.bindGameManager(this);
	}

	#setupEvents() {
		this.eventSystem.addListener("BOARD_TICK", this.evGTickBoard);
		this.eventSystem.addListener("START", this.evGStart);
		this.eventSystem.addListener("PLAYER_ACTION_START", this.evGPlayerActionStart);
	}

	run() {
		const event = createGameEvent("START", {});
		this.eventSystem.dispatch(event);
	}

	/** @type {GEV_Listener<"START">} */
	evGStart() {
		this.player.drawHand(1);

		const eventPlayerActionStart = createGameEvent("PLAYER_ACTION_START", { player: this.player });
		this.eventSystem.dispatch(eventPlayerActionStart);
	}

	/** @type {GEV_Listener<"PLAYER_ACTION_START">} */
	evGPlayerActionStart() {
		this.state = "PLAYER_ACTION";
		this.uiManager.setInteractive("NONE");
	}

	/** @type {GEV_Listener<"BOARD_TICK">} */
	evGTickBoard() {
		this.gameBoard.fullBoard().forEach((boardCell) => {
			if (boardCell.card != null) {
				const pos = boardCell.pos;
				const event = createGameEvent("CARD_TICK", { pos: pos, target: boardCell.card });
				this.eventSystem.dispatch(event);
			}
		});
	}
}
