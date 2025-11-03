import { _v } from "../libs/_v.js";
import { methodBind } from "../libs/utils.js";
import { UIBoard } from "./uiBoard.js";

export class UIManager {
	/** @type {HTMLDivElement} */
	boardDiv;
	/** @type {?GameManager} */
	#manager;

	/**
	 * @param {HTMLDivElement} hostWindow
	 */
	constructor(hostWindow) {
		methodBind(this, "ev");
		this.#manager = null;

		/** @type {?HTMLDivElement} */
		const mainDiv = hostWindow.querySelector("div.main");
		if (mainDiv == null) throw new Error("Main Div is not found");
		this.boardDiv = mainDiv;

		this.uiBoard = new UIBoard(this);

		window.addEventListener("resize", this.evResize);
	}

	/** @param {GameManager} gameManager */
	bindGameManager(gameManager) {
		this.#manager = gameManager;
		this.#manager.eventSystem.addListener("CARD_DRAWN", this.evGCardDrawn);

		this.uiBoard.init();
	}

	/** @type {GameManager} */
	get gameManager() {
		if (this.#manager == null) throw new Error("No gameManager is bound");
		return this.#manager;
	}

	updateUI() {
		this.uiBoard.updateUI();
	}

	evResize() {
		this.updateUI();
	}

	/** @type {EV_CallbackEventListener<"CARD_DRAWN">} */
	evGCardDrawn(event) {
		const card = event.data.drawnCard;
		this.boardDiv.appendChild(card.uiData.container);

		event.data.player.hand;
		const handLen = event.data.player.hand.length;
		const inHandIndex = event.data.player.hand.indexOf(event.data.drawnCard);
	}
}
