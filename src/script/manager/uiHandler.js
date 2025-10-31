import { CardUI } from "../card/cardUI.js";
import { _v } from "../libs/_v.js";
import { boardPos, createElement, methodBind } from "../libs/utils.js";

/** @type {number} */
const CARD_SIZE = 200;

export class UIHandler {
	/** @type {CardEntity[]} */
	cardsOnBoard;

	/** @type {CardPlaceholder[]} */
	#cardPlaceholders;

	/**
	 * @param {Manager} mgr
	 * @param {HTMLDivElement} mainWindow
	 */
	constructor(mgr, mainWindow) {
		methodBind(this);
		this.boundMgr = mgr;
		this.mainDiv = mainWindow;

		/* #region  sizing */
		const comp_ = this.mainDiv.getBoundingClientRect();
		this.top_left = new _v(comp_.x, comp_.y);
		this.bottom_right = this.top_left.add(new _v(comp_.width, comp_.height).divScalar(2));
		/* #endregion */

		this.cardHeight = CARD_SIZE;
		this.cardWidth = this.cardHeight * CardUI.aspectRatio;

		this.cardsOnBoard = [];

		this.gap_x = 50;
		this.gap_y = 30;

		this.#cardPlaceholders = [];
		for (let i = 0; i < this.boundMgr.board.dims.col; i++) {
			for (let j = 0; j < this.boundMgr.board.dims.row; j++) {
				const cardPC = new CardPlaceholder(this, new boardPos(i, j));
				this.#addPlaceholder(cardPC);
			}
		}
		this.boardSelector = new CardSelector(this);
		this.boardSelector.reload();

		window.addEventListener("resize", this.evResize);
	}

	/**
	 * @param {CardEntity} card
	 * @param {boardPos} pos
	 */
	placeCard(card, pos) {
		// INFO: error handle
		if (!this.boundMgr.board.isValidPosition(pos)) throw new Error(`Cant place card at position ${pos}`);
		if (this.boundMgr.board.getCard(pos) != null) throw Error(`Trying to place card where card already is: ${pos}`);

		if (this.cardsOnBoard.includes(card)) this.removeCard(card);

		card.uiData.set({ isEnemy: pos.col >= this.boundMgr.board.dims.col / 2 });
		this.mainDiv.appendChild(card.uiData.container);

		card.cardBoardPosition = pos;
		this.cardsOnBoard.push(card);
		this.boundMgr.board.setCard(pos, card);

		this.updateUI();
	}

	/** @param {CardEntity} card */
	removeCard(card) {
		if (!this.cardsOnBoard.includes(card)) throw new Error(`Removing card that is not on board`);
		card.uiData.container.remove();

		if (card.cardBoardPosition == null) throw new Error("How? [no position when removing card from board]");
		const pos = card.cardBoardPosition;
		card.cardBoardPosition = null;
		this.boundMgr.board.setCard(pos, null);

		const idx = this.cardsOnBoard.indexOf(card);
		if (idx > -1) this.cardsOnBoard.splice(idx, 1);
	}

	/** @param {CardEntity} card*/
	updateCard(card) {
		if (card.cardBoardPosition == null) throw new Error("Updating cardEntity that is not on board");
		card.uiData.set({
			cardSize: this.cardHeight,
			position: this.getPositionFromBoard(card.cardBoardPosition),
		});
	}

	updateUI() {
		const comp_ = this.mainDiv.getBoundingClientRect();
		this.top_left = new _v(comp_.x, comp_.y);
		this.bottom_right = this.top_left.add(new _v(comp_.width, comp_.height));

		for (const card of this.cardsOnBoard) {
			this.updateCard(card);
		}
		for (const placeholder of this.#cardPlaceholders) {
			placeholder.reload();
		}
	}

	/**
	 * @param {boardPos} boardPos
	 * @returns {_v}
	 */
	getPositionFromBoard(boardPos) {
		const { col: i, row: j } = boardPos;
		const center = this.top_left.add(this.bottom_right).divScalar(2);

		const { col: cols, row: rows } = this.boundMgr.board.dims;

		const cardX = (-0.5 * (cols - 1) + i) * (this.cardWidth + this.gap_x);
		const cardY = (-0.5 * (rows - 1) + j) * (this.cardHeight + this.gap_y);
		const _off = new _v(cardX, cardY);

		return center.add(_off);
	}

	evResize() {
		this.updateUI();
	}

	/** @param {CardPlaceholder} placeholder */
	#addPlaceholder(placeholder) {
		this.#cardPlaceholders.push(placeholder);
		this.mainDiv.appendChild(placeholder.container);
		placeholder.reload();
	}
}

class CardPlaceholder {
	/** @type {boardPos} */
	boardPos;
	/** @type {HTMLDivElement} */
	container;
	/** @type {_v} */
	size;

	/**
	 * @param {UIHandler} UIHandler
	 * @param {boardPos} pos
	 */
	constructor(UIHandler, pos) {
		methodBind(this);
		this.UIHandler = UIHandler;
		this.size = new _v(this.UIHandler.cardWidth, this.UIHandler.cardHeight);
		this.boardPos = pos;
		// @ts-ignore
		this.container = createElement("div.cardPlaceholder");
		this.container.addEventListener("mouseenter", this.EV_MouseEnter);
		this.container.addEventListener("mouseleave", this.EV_MouseLeave);
	}

	/**
	 * @param {object} values
	 * @param {_v} [values.size]
	 * @param {boardPos} [values.bPos]
	 */
	set(values) {
		if (values.size != null) {
			this.size = values.size;
		}
		if (values.bPos != null) {
			this.boardPos = values.bPos;
		}
		this.reload();
	}

	reload() {
		const { x, y } = this.UIHandler.getPositionFromBoard(this.boardPos);
		const PCStyle = this.container.style;

		PCStyle.setProperty("left", `${x}px`);
		PCStyle.setProperty("top", `${y}px`);
		PCStyle.setProperty("width", `${this.size.x}px`);
		PCStyle.setProperty("height", `${this.size.y}px`);
	}

	/** @param {MouseEvent} ev */
	EV_MouseEnter(ev) {
		const sel = this.UIHandler.boardSelector;
		if (sel.fadeTimoutId != null) {
			window.clearTimeout(sel.fadeTimoutId);
			sel.fadeTimoutId = null;
		}
		sel.set({
			bPos: this.boardPos,
			active: true,
		});
	}

	/** @param {MouseEvent} ev */
	EV_MouseLeave(ev) {
		const sel = this.UIHandler.boardSelector;
		sel.set({ bPos: null });
		console.log("aaa");

		sel.fadeTimoutId = window.setTimeout(() => {
			if (sel.boardPos == null) sel.set({ active: false });
		}, 1000);
	}
}

class CardSelector {
	/** @type {?boardPos} */
	boardPos;
	/** @type {HTMLDivElement} */
	container;
	/** @type {_v} */
	size;

	/** @type {boolean} */
	active;
	/** @type {?number} */
	fadeTimoutId;

	/**
	 * @param {UIHandler} UIHandler
	 */
	constructor(UIHandler) {
		this.UIHandler = UIHandler;
		this.size = new _v(this.UIHandler.cardWidth, this.UIHandler.cardHeight);
		this.boardPos = null;
		this.active = false;
		// @ts-ignore
		this.container = createElement("div.cardSelector");
		this.UIHandler.mainDiv.appendChild(this.container);

		this.fadeTimoutId = null;
	}

	/**
	 * @param {object} values
	 * @param {_v} [values.size]
	 * @param {boardPos | null} [values.bPos]
	 * @param {boolean} [values.active]
	 */
	set(values) {
		if (values.size != null) {
			this.size = values.size;
		}
		if (values.bPos !== undefined) {
			this.boardPos = values.bPos;
		}
		if (values.active != null) {
			this.active = values.active;
		}
		this.reload();
	}

	reload() {
		const CardSelectorStyle = this.container.style;
		CardSelectorStyle.setProperty("width", `${this.size.x}px`);
		CardSelectorStyle.setProperty("height", `${this.size.y}px`);
		CardSelectorStyle.setProperty("--opacity", this.active ? "1" : "0");

		if (this.boardPos !== null) {
			const { x, y } = this.UIHandler.getPositionFromBoard(this.boardPos);
			CardSelectorStyle.setProperty("--x", `${x}px`);
			CardSelectorStyle.setProperty("--y", `${y}px`);
		}
	}
}
