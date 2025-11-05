import { CardEntity } from "../card/cardEntity.js";
import { CardUI } from "../card/cardUI.js";
import { _v } from "../libs/_v.js";
import { boardPos as BoardPos, createElement, methodBind } from "../libs/utils.js";
import { createGameEvent } from "./eventSystem.js";
import { UIManager } from "./uiManager.js";

/** @typedef {"disabled" | "enabled" | "selected"} PCEState */

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

	/**
	 * @param {BoardPos} pos
	 * @returns {CardPlaceholder}
	 */
	getPlaceholder(pos) {
		if (this.#cardPlaceholders == null) throw new Error("UIManager is not bound [UIBoard]");
		const _selected = this.#cardPlaceholders.filter((cph) => cph.pos?.col == pos.col && cph.pos?.row == pos.row);
		if (_selected.length == 0) throw new Error(`no placeholder found at position ${pos}`);
		return _selected[0];
	}

	init() {
		this.#cardPlaceholders = [];

		for (let i = 0; i < this.gameBoard.dims.col; i++) {
			for (let j = 0; j < this.gameBoard.dims.row; j++) {
				const cardPC = new CardPlaceholder(this, new BoardPos(i, j));
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
		if (card.pos == null) throw new Error("Updating cardEntity that is not on board");

		if (!this.uiManager.boardDiv.contains(card.container)) {
			this.uiManager.boardDiv.appendChild(card.container);
		}

		card.uiData.set({
			cardSize: this.cardHeight,
			position: this.convertBoardToVector(card.pos),
		});
	}

	updateUI() {
		if (this.#cardPlaceholders == null) throw new Error("[gameBoard]: No gameManager is bound");

		const comp_ = this.uiManager.boardDiv.getBoundingClientRect();
		this.top_left = new _v(comp_.x, comp_.y);
		this.bottom_right = this.top_left.add(new _v(comp_.width, comp_.height));

		/** @type {NodeListOf<HTMLDivElement>} */
		const cardContainerMainNodeList = this.uiManager.boardDiv.querySelectorAll("div.card");
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
	 * @param {BoardPos} bPos
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
	/** @type {?BoardPos} */
	pos;
	/** @type {HTMLDivElement} */
	container;
	/** @type {_v} */
	size;

	/**
	 * @param {UIBoard} uiBoard
	 * @param {?BoardPos} pos
	 * @param {string} classname
	 */
	constructor(uiBoard, pos, classname) {
		methodBind(this);
		this.uiBoard = uiBoard;
		this.size = new _v(this.uiBoard.cardWidth, this.uiBoard.cardHeight);
		this.pos = pos;
		// @ts-ignore
		this.container = createElement(`div.${classname}.cardGeneral`);
	}

	reload() {
		const PCEStyle = this.container.style;

		PCEStyle.setProperty("width", `${this.size.x}px`);
		PCEStyle.setProperty("height", `${this.size.y}px`);

		if (this.pos !== null) {
			const { x, y } = this.uiBoard.convertBoardToVector(this.pos);
			PCEStyle.setProperty("--x", `${x}px`);
			PCEStyle.setProperty("--y", `${y}px`);
		}
	}
}

class CardPlaceholder extends PseudoCardElement {
	/** @type {PCEState} */
	state;
	/**
	 * @param {UIBoard} uiBoard
	 * @param {BoardPos} pos
	 */
	constructor(uiBoard, pos) {
		super(uiBoard, pos, "cardPlaceholder");
		methodBind(this, "ev");

		this.state = "disabled";

		this.container.addEventListener("mouseenter", this.evUIMouseEnter);
		this.container.addEventListener("mouseleave", this.evUIMouseLeave);
		this.container.addEventListener("click", this.evUIClick);
	}

	/**
	 * @param {object} values
	 * @param {_v} [values.size]
	 * @param {BoardPos} [values.bPos]
	 * @param {PCEState} [values.state]
	 */
	set(values) {
		if (values.size != null) {
			this.size = values.size;
		}
		if (values.bPos != null) {
			this.pos = values.bPos;
		}
		if (values.state != null) {
			this.state = values.state;
		}
		this.reload();
	}

	reload() {
		super.reload();
		this.container.setAttribute("state", this.state);
	}

	evUIMouseEnter() {
		const sel = this.uiBoard.boardSelector;
		if (sel == null) throw new Error("[cardPlaceholder]: GameManager is not bound");

		if (sel.fadeTimoutId != null) {
			window.clearTimeout(sel.fadeTimoutId);
			sel.fadeTimoutId = null;
		}
		sel.set({
			bPos: this.pos,
			state: "enabled",
		});
	}

	evUIMouseLeave() {
		const sel = this.uiBoard.boardSelector;
		if (sel == null) throw new Error("[cardPlaceholder]: GameManager is not bound");

		sel.set({ bPos: null });

		sel.fadeTimoutId = window.setTimeout(() => {
			if (sel.pos == null) sel.set({ state: "disabled" });
		}, 1000);
	}

	evUIClick() {
		if (this.pos == null) throw new Error("How? [Clicked placeholder without position]");
		if (this.uiBoard.uiManager.gameManager.state != "PLAYER_ACTION") return;

		const selected = this.uiBoard.uiManager.selectedInputCard;
		if (selected == null) return;
		if (!(selected instanceof CardEntity))
			throw new Error("How? [Clicked on placeholder but !CardEntity was selected]");

		const event = createGameEvent("CARD_MOVE", {
			from: "hand",
			to: this.pos,
			card: selected,
		});
		this.uiBoard.uiManager.gameManager.eventSystem.dispatch(event);
	}
}

class CardSelector extends PseudoCardElement {
	/** @type {PCEState} */
	state;
	/** @type {?number} */
	fadeTimoutId;

	/**
	 * @param {UIBoard} uiBoard
	 */
	constructor(uiBoard) {
		super(uiBoard, null, "cardSelector");

		this.pos = null;
		this.state = "disabled";
		this.fadeTimoutId = null;
	}

	/**
	 * @param {object} values
	 * @param {_v} [values.size]
	 * @param {BoardPos | null} [values.bPos]
	 * @param {PCEState} [values.state]
	 */
	set(values) {
		if (values.size != null) {
			this.size = values.size;
		}
		if (values.bPos !== undefined) {
			this.pos = values.bPos;
		}
		if (values.state != null) {
			this.state = values.state;
		}
		this.reload();
	}

	reload() {
		super.reload();
		this.container.setAttribute("state", this.state);
	}
}
