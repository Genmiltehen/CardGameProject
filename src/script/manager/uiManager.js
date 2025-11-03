import { _v } from "../libs/_v.js";
import { methodBind } from "../libs/utils.js";
import { UIBoard } from "./uiBoard.js";

export class UIManager {
	/** @type {HTMLDivElement} */
	boardDiv;
	/** @type {HTMLDivElement} */
	handDiv;
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

		/** @type {?HTMLDivElement} */
		const handDiv = hostWindow.querySelector("div.hand");
		if (handDiv == null) throw new Error("Main Div is not found");
		this.handDiv = handDiv;

		this.uiBoard = new UIBoard(this);

		window.addEventListener("resize", this.evResize);
	}

	/** @param {GameManager} gameManager */
	bindGameManager(gameManager) {
		this.#manager = gameManager;
		this.#manager.eventSystem.addListener("CARD_DRAWN", this.evGCardDrawn);
		this.#manager.eventSystem.addListener("CARD_DISCARDED", this.evGCardDiscarded);

		this.uiBoard.init();
	}

	/** @type {GameManager} */
	get gameManager() {
		if (this.#manager == null) throw new Error("No gameManager is bound");
		return this.#manager;
	}

	updateUI() {
		this.uiBoard.updateUI();
		this.updateHandUI();
	}

	updateHandUI() {
		const hand = this.gameManager.player.hand;
		hand.forEach((card) => {
			const handLengthM_1 = hand.length - 1;
			const inHandIndex = hand.indexOf(card);

			const rel = handLengthM_1 == 0 ? 0 : (2 * inHandIndex - handLengthM_1) / handLengthM_1;

			card.container.style.setProperty("--value", rel.toString());
		});
	}

	evResize() {
		this.updateUI();
	}

	/** @type {EV_CallbackEventListener<"CARD_DRAWN">} */
	evGCardDrawn(event) {
		const card = event.data.drawnCard;
		card.container.classList.remove("fixedCard");
		card.container.style.setProperty("left", "0%");

		this.handDiv.appendChild(card.container);

		window.setTimeout(() => {
			card.container.style.removeProperty("left");
			card.container.classList.add("onHand");
			this.updateHandUI();
		}, 100);
	}

	/** @type {EV_CallbackEventListener<"CARD_DISCARDED">} */
	evGCardDiscarded(event) {
		const card = event.data.discardedCard;
		card.container.style.setProperty("left", "100%");
		card.container.style.setProperty("pointer-events", "none");
		card.container.classList.remove("onHand");
		
		window.setTimeout(() => {
			card.container.remove();
			card.container.style.removeProperty("left");
			card.container.style.removeProperty("pointer-events");
		}, 200);
	}
}
