import { _v } from "../libs/_v.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { PlayerFighter } from "../player/playerFighter.js";
import { CardEventSystem } from "./cardEventSystem.js";
import { UIHandler } from "./uiHandler.js";

/**
 * @typedef iteratorResult
 * @property {boardPos} pos
 * @property {CardEntity} [card]
 */

/**
 *  @typedef {""} gameState
 */

const BOARD_SIZE = { col: 6, row: 3 };

export class Manager {
	/** @type {UIHandler} */
	uiHandler;
	/** @type {Board} */
	board;
	/** @type {CardEventSystem} */
	eventSystem;

	/** @type {PlayerFighter} */
	player;

	/**
	 * @param {HTMLDivElement} mainWindow
	 * @param {PlayerData} playerData
	 */
	constructor(mainWindow, playerData) {
		methodBind(this);
		this.board = new Board(BOARD_SIZE);
		this.uiHandler = new UIHandler(this, mainWindow);
		this.eventSystem = new CardEventSystem();

		this.player = new PlayerFighter(this, playerData);
		// this.player

		this.#setupEvents();
	}

	#setupEvents() {
		this.eventSystem.addListener("TICK_BOARD", this.tickBoard);
	}

	tickBoard() {
		for (const cardEnemyData of this.board.iterEnemies()) {
			if (cardEnemyData.card != null) {
				const pos = cardEnemyData.pos;
				/** @type {EV_GameEvent} */
				const cardEvent = {
					source: this,
					target: cardEnemyData.card,
					data: {
						pos: pos,
					},
				};
				this.eventSystem.dispatchEvent("TICK", cardEvent);
			}
		}
		for (const cardEnemyData of this.board.iterAllies()) {
			if (cardEnemyData.card != null) {
				const pos = cardEnemyData.pos;
				/** @type {EV_GameEvent} */
				const cardEvent = {
					source: this,
					target: cardEnemyData.card,
					data: {
						pos: pos,
					},
				};
				this.eventSystem.dispatchEvent("TICK", cardEvent);
			}
		}
	}
}

class Board {
	/**
	 * @constructor
	 * @param {boardPos} dims
	 */
	constructor(dims) {
		this.dims = dims;
		/** @type {(?CardEntity)[][]} */
		this.arr = Array.from(Array(this.dims.row), () => new Array(this.dims.col).fill(null));
	}

	/**
	 * @param {boardPos} pos
	 * @returns {boolean}
	 */
	isValidPosition(pos) {
		if (!(0 <= pos.col && pos.col < this.dims.col)) return false;
		if (!(0 <= pos.row && pos.row < this.dims.row)) return false;
		return true;
	}

	/**
	 * @param {boardPos} pos
	 * @returns {?CardEntity}
	 */
	getCard(pos) {
		return this.arr[pos.row][pos.col];
	}

	/**
	 * @param {boardPos} pos
	 * @param {?CardEntity} card
	 */
	setCard(pos, card) {
		this.arr[pos.row][pos.col] = card;
	}

	/**
	 * @param {number} idx
	 * @yields {iteratorResult}
	 */
	*iterRow(idx) {
		for (let i = 0; i < this.dims.col; i++) {
			const pos = new boardPos(i, idx);
			yield {
				pos: pos,
				card: this.getCard(pos),
			};
		}
	}

	/**
	 * @param {number} idx
	 * @yields {iteratorResult}
	 */
	*iterCol(idx) {
		for (let i = 0; i < this.dims.row; i++) {
			const pos = new boardPos(idx, i);
			yield {
				pos: pos,
				card: this.getCard(pos),
			};
		}
	}

	*iterEnemies() {
		const enemy_half = this.dims.col / 2;
		for (const col_id of new Array(enemy_half).keys()) {
			const enemy_col_id = enemy_half + col_id;
			yield* this.iterCol(enemy_col_id);
		}
	}

	*iterAllies() {
		const enemy_half = this.dims.col / 2;
		for (const col_id of new Array(enemy_half).keys()) {
			const ally_col_id = enemy_half - col_id - 1;
			yield* this.iterCol(ally_col_id);
		}
	}

	*iterFullBoard() {
		yield* this.iterEnemies();
		yield* this.iterAllies();
	}

	/** @param {"enemy"|"ally"|"full"} type */
	*iterBoard(type) {
		switch (type) {
			case "enemy":
				yield* this.iterEnemies();
				break;

			case "ally":
				yield* this.iterAllies();
				break;

			case "ally":
				yield* this.iterAllies();
				break;

			default:
				break;
		}
	}
}
