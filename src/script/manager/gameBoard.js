import { boardPos } from "../libs/utils.js";

export class GameBoard {
	/** @type {CardEntity[]} */
	cardsOnBoard;

	/**
	 * @constructor
	 * @param {GameManager} gameManager
	 * @param {boardPos} dims
	 */
	constructor(gameManager, dims) {
		this.gameManager = gameManager;
		this.dims = dims;
		/** @type {(?CardEntity)[][]} */
		this.arr = Array.from(Array(this.dims.row), () => new Array(this.dims.col).fill(null));

		this.cardsOnBoard = [];
	}

	/**
	 * @param {CardEntity} card
	 * @param {boardPos} pos
	 */
	placeCard(card, pos) {
		if (this.cardsOnBoard == null) throw new Error("[gameBoard]: No gameManager is bound");

		if (!this.isValidPosition(pos)) throw new Error(`Cant place card at position ${pos}`);
		if (this.getCard(pos) != null) throw Error(`Trying to place card where card already is: ${pos}`);

		if (this.cardsOnBoard.includes(card)) this.removeCard(card);

		card.uiData.set({
			isEnemy: pos.col >= this.dims.col / 2,
			isFixed: true,
		});

		card.cardBoardPosition = pos;
		this.cardsOnBoard.push(card);
		this.setCard(pos, card);

		if (this.gameManager.uiManager != null) {
			this.gameManager.uiManager.uiBoard.updateUI();
		}
	}

	/**
	 * @param {CardEntity} card
	 */
	removeCard(card) {
		if (this.cardsOnBoard == null) throw new Error("[gameBoard]: No gameManager is bound");

		if (!this.cardsOnBoard.includes(card)) throw new Error(`Removing card that is not on board`);
		card.container.remove();

		if (card.cardBoardPosition == null) throw new Error("How? [no position when removing card from board]");
		const pos = card.cardBoardPosition;
		card.cardBoardPosition = null;
		this.setCard(pos, null);

		const idx = this.cardsOnBoard.indexOf(card);
		if (idx > -1) this.cardsOnBoard.splice(idx, 1);
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
