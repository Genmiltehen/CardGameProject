import { BoardPos } from "../libs/utils.js";

export class GameBoard {
	/** @type {Set<CardEntity>} */
	cardsOnBoard;

	/**
	 * @constructor
	 * @param {GameManager} gameManager
	 * @param {BoardPos} dims
	 */
	constructor(gameManager, dims) {
		this.gameManager = gameManager;
		this.dims = dims;
		/** @type {(?CardEntity)[][]} */
		this.arr = Array.from(Array(this.dims.row), () => new Array(this.dims.col).fill(null));

		this.cardsOnBoard = new Set();
	}

	/**
	 * @param {CardEntity} card1
	 * @param {CardEntity} card2
	 */
	swapCards(card1, card2) {
		console.log("aaa");
		
		if (!this.cardsOnBoard.has(card1)) {
			console.log(card1);
			throw new Error("card1 is not on board");
		}
		if (!this.cardsOnBoard.has(card2)) {
			console.log(card2);
			throw new Error("card2 is not on board");
		}

		if (card1.pos == null) throw new Error("How? [no position when removing card from board]");
		if (card2.pos == null) throw new Error("How? [no position when removing card from board]");

		const pos1 = card1.pos;
		const pos2 = card2.pos;

		this.setCard(pos2, card1);
		this.setCard(pos1, card2);

		const allyUIManager = this.gameManager.getUIManager("ally");
		if (allyUIManager != null) {
			allyUIManager.uiBoard.updateUI();
		}
	}

	/**
	 * @param {CardEntity} card
	 * @param {BoardPos} pos
	 */
	placeCard(card, pos) {
		if (!this.isValidPosition(pos)) throw new Error(`Cant place card at position ${pos}`);
		if (this.getCard(pos) != null) throw Error(`Trying to place card where card already is: ${pos}`);
		if (this.cardsOnBoard.has(card)) this.removeCard(card);

		this.setCard(pos, card);

		card.uiData.set({
			isEnemy: pos.col >= this.dims.col / 2,
			positioning: "fixed",
			state: "locked",
		});

		const allyUIManager = this.gameManager.getUIManager("ally");
		if (allyUIManager != null) {
			allyUIManager.uiBoard.updateUI();
		}
	}

	/** @param {CardEntity} card */
	removeCard(card) {
		if (!this.cardsOnBoard.has(card)) throw new Error(`Removing card that is not on board`);
		if (card.pos == null) throw new Error("How? [no position when removing card from board]");

		this.popCard(card.pos);

		card.uiData.set({
			isEnemy: false,
			positioning: "none",
			state: "none",
		});
	}

	/**
	 * @param {BoardPos} pos
	 * @returns {boolean}
	 */
	isValidPosition(pos) {
		if (!(0 <= pos.col && pos.col < this.dims.col)) return false;
		if (!(0 <= pos.row && pos.row < this.dims.row)) return false;
		return true;
	}

	/**
	 * @param {BoardPos} pos
	 * @returns {?CardEntity}
	 */
	getCard(pos) {
		return this.arr[pos.row][pos.col];
	}

	/**
	 * @param {BoardPos} pos
	 * @param {CardEntity} card
	 */
	setCard(pos, card) {
		this.cardsOnBoard.add(card);
		this.arr[pos.row][pos.col] = card;
		card.pos = pos;
	}

	/** @param {BoardPos} pos  */
	popCard(pos) {
		const oldCard = this.arr[pos.row][pos.col];
		if (oldCard != null) {
			this.cardsOnBoard.delete(oldCard);
			oldCard.pos = null;
			this.arr[pos.row][pos.col] = null;
		}
	}

	/**
	 * @param {number} idx
	 * @returns {BoardCell[]}
	 */
	row(idx) {
		const res = [];
		for (let i = 0; i < this.dims.col; i++) {
			const pos = new BoardPos(i, idx);
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
			const pos = new BoardPos(idx, i);
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
