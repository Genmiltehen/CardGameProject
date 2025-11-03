import { _v } from "../libs/_v.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { PlayerFighter } from "../player/playerFighter.js";
import { CardEventSystem, createGameEvent } from "./eventSystem.js";
import { GameBoard } from "./gameBoard.js";
import { UIManager } from "./uiManager.js";

/**
 * @typedef iteratorResult
 * @property {boardPos} pos
 * @property {CardEntity} [card]
 */

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

	/**
	 * @param {PlayerData} playerData
	 */
	constructor(playerData) {
		methodBind(this, "ev");
		this.gameBoard = new GameBoard(this, BOARD_SIZE);
		this.eventSystem = new CardEventSystem();
		this.#uiManager = null;

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
		this.eventSystem.addListener("TICK_BOARD", this.evGTickBoard);
	}

	evGTickBoard() {
		for (const cardEnemyData of this.gameBoard.iterEnemies()) {
			if (cardEnemyData.card != null) {
				const pos = cardEnemyData.pos;
				const event = createGameEvent("TICK", { pos: pos, target: cardEnemyData.card });
				this.eventSystem.dispatchEvent(event);
			}
		}
		for (const cardAllyData of this.gameBoard.iterAllies()) {
			if (cardAllyData.card != null) {
				const pos = cardAllyData.pos;
				const event = createGameEvent("TICK", { pos: pos, target: cardAllyData.card });
				this.eventSystem.dispatchEvent(event);
			}
		}
	}
}
