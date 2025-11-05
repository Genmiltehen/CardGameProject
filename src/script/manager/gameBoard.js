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
			positioning: "fixed",
			state: "locked",
		});

		card.pos = pos;
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

		if (card.pos == null) throw new Error("How? [no position when removing card from board]");
		const pos = card.pos;
		card.pos = null;
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
	 * @returns {BoardCell[]}
	 */
	row(idx) {
		const res = [];
		for (let i = 0; i < this.dims.col; i++) {
			const pos = new boardPos(i, idx);
			res.push({
				pos: pos,
				card: this.getCard(pos),
			});
		}
		return res;
	}

	/**
	 * @param {number} idx
	 * @returns {BoardCell[]}
	 */
	col(idx) {
		const res = [];
		for (let i = 0; i < this.dims.row; i++) {
			const pos = new boardPos(idx, i);
			res.push({
				pos: pos,
				card: this.getCard(pos),
			});
		}
		return res;
	}

	/** @returns {BoardCell[]} */
	enemySide() {
		/** @type {BoardCell[]} */
		const res = [];
		const half = this.dims.col / 2;
		for (const col_id of new Array(half).keys()) {
			const enemy_col_id = half + col_id;
			res.push(...this.col(enemy_col_id));
		}
		return res;
	}

	/** @returns {BoardCell[]} */
	allySide() {
		/** @type {BoardCell[]} */
		const res = [];
		const half = this.dims.col / 2;
		for (const col_id of new Array(half).keys()) {
			const ally_col_id = half - col_id - 1;
			res.push(...this.col(ally_col_id));
		}
		return res;
	}

	/** @returns {BoardCell[]} */
	fullBoard() {
		/** @type {BoardCell[]} */
		const res = [];
		res.push(...this.enemySide());
		res.push(...this.allySide());
		return res;
	}
}
