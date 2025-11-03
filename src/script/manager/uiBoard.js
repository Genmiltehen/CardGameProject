import { CardUI } from "../card/cardUI.js";
import { _v } from "../libs/_v.js";
import { boardPos, createElement, methodBind } from "../libs/utils.js";
import { UIManager } from "./uiManager.js";

/** @type {number} */
const CARD_SIZE = 200;

export class UIBoard {
	/** @type {?(CardPlaceholder[])} */
	#cardPlaceholders;
	/** @type {?CardSelector} */
	boardSelector;

	/**
	 * @constructor
	 * @param {UIManager} uiManager
	 */
	constructor(uiManager) {
		this.uiManager = uiManager;

		this.#cardPlaceholders = null;
		this.boardSelector = null;

		this.gap_x = 50;
		this.gap_y = 30;

		const comp_ = this.uiManager.boardDiv.getBoundingClientRect();
		this.top_left = new _v(comp_.x, comp_.y);
		this.bottom_right = this.top_left.add(new _v(comp_.width, comp_.height).divScalar(2));

		this.cardHeight = CARD_SIZE;
		this.cardWidth = this.cardHeight * CardUI.aspectRatio;
	}

	/** @type {GameBoard} */
	get gameBoard() {
		return this.uiManager.gameManager.gameBoard;
	}

	init() {
		this.#cardPlaceholders = [];

		for (let i = 0; i < this.gameBoard.dims.col; i++) {
			for (let j = 0; j < this.gameBoard.dims.row; j++) {
				const cardPC = new CardPlaceholder(this, new boardPos(i, j));
				this.#addPlaceholder(cardPC);
			}
		}

		this.boardSelector = new CardSelector(this);
		this.uiManager.boardDiv.appendChild(this.boardSelector.container);
		this.boardSelector.reload();

		this.updateUI();
	}

	/** @param {CardEntity} card*/
	updateCard(card) {
		if (card.cardBoardPosition == null) throw new Error("Updating cardEntity that is not on board");

		if (!this.uiManager.boardDiv.contains(card.container)) {
			this.uiManager.boardDiv.appendChild(card.container);
		}

		card.uiData.set({
			cardSize: this.cardHeight,
			position: this.convertBoardToVector(card.cardBoardPosition),
		});
	}

	updateUI() {
		if (this.#cardPlaceholders == null) throw new Error("[gameBoard]: No gameManager is bound");

		const comp_ = this.uiManager.boardDiv.getBoundingClientRect();
		this.top_left = new _v(comp_.x, comp_.y);
		this.bottom_right = this.top_left.add(new _v(comp_.width, comp_.height));

		/** @type {NodeListOf<HTMLDivElement>} */
		const cardContainerMainNodeList = this.uiManager.boardDiv.querySelectorAll("div.cardUImain");
		const cardContainerBoardArray = this.gameBoard.cardsOnBoard.map((card) => card.container);

		cardContainerMainNodeList.forEach((elem) => {
			if (!cardContainerBoardArray.includes(elem)) {
				elem.remove();
			}
		});

		for (const card of this.gameBoard.cardsOnBoard) {
			this.updateCard(card);
		}
		for (const placeholder of this.#cardPlaceholders) {
			placeholder.reload();
		}
	}

	/** @param {CardPlaceholder} placeholder */
	#addPlaceholder(placeholder) {
		if (this.#cardPlaceholders == null) throw new Error("How? [No cardPlaceholder array after init]");

		this.#cardPlaceholders.push(placeholder);
		this.uiManager.boardDiv.appendChild(placeholder.container);
		placeholder.reload();
	}

	/**
	 *
	 * @param {boardPos} bPos
	 * @returns {_v}
	 */
	convertBoardToVector(bPos) {
		const { col: i, row: j } = bPos;
		const center = this.top_left.add(this.bottom_right).divScalar(2);

		const { col: cols, row: rows } = this.uiManager.gameManager.gameBoard.dims;

		const cardX = (-0.5 * (cols - 1) + i) * (this.cardWidth + this.gap_x);
		const cardY = (-0.5 * (rows - 1) + j) * (this.cardHeight + this.gap_y);
		const _off = new _v(cardX, cardY);

		return center.add(_off);
	}
}

class PseudoCardElement {
	/** @type {?boardPos} */
	boardPos;
	/** @type {HTMLDivElement} */
	container;
	/** @type {_v} */
	size;

	/**
	 * @param {UIBoard} uiBoard
	 * @param {?boardPos} pos
	 * @param {string} classname
	 */
	constructor(uiBoard, pos, classname) {
		methodBind(this);
		this.uiBoard = uiBoard;
		this.size = new _v(this.uiBoard.cardWidth, this.uiBoard.cardHeight);
		this.boardPos = pos;
		// @ts-ignore
		this.container = createElement(`div.${classname}.cardGeneral`);
	}

	reload() {
		const PCEStyle = this.container.style;

		PCEStyle.setProperty("width", `${this.size.x}px`);
		PCEStyle.setProperty("height", `${this.size.y}px`);

		if (this.boardPos !== null) {
			const { x, y } = this.uiBoard.convertBoardToVector(this.boardPos);
			PCEStyle.setProperty("--x", `${x}px`);
			PCEStyle.setProperty("--y", `${y}px`);
		}
	}
}

class CardPlaceholder extends PseudoCardElement {
	/**
	 * @param {UIBoard} uiBoard
	 * @param {boardPos} pos
	 */
	constructor(uiBoard, pos) {
		super(uiBoard, pos, "cardPlaceholder");
		methodBind(this);

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

	EV_MouseEnter() {
		const sel = this.uiBoard.boardSelector;
		if (sel == null) throw new Error("[cardPlaceholder]: GameManager is not bound");

		if (sel.fadeTimoutId != null) {
			window.clearTimeout(sel.fadeTimoutId);
			sel.fadeTimoutId = null;
		}
		sel.set({
			bPos: this.boardPos,
			active: true,
		});
	}

	EV_MouseLeave() {
		const sel = this.uiBoard.boardSelector;
		if (sel == null) throw new Error("[cardPlaceholder]: GameManager is not bound");

		sel.set({ bPos: null });
		console.log("aaa");

		sel.fadeTimoutId = window.setTimeout(() => {
			if (sel.boardPos == null) sel.set({ active: false });
		}, 1000);
	}
}

class CardSelector extends PseudoCardElement {
	/** @type {boolean} */
	active;
	/** @type {?number} */
	fadeTimoutId;

	/**
	 * @param {UIBoard} uiBoard
	 */
	constructor(uiBoard) {
		super(uiBoard, null, "cardSelector");

		this.boardPos = null;
		this.active = false;
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
		super.reload();
		this.container.style.setProperty("--opacity", this.active ? "1" : "0");
	}
}
