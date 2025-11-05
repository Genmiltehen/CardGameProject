import { _v } from "../libs/_v.js";
import { boardPos, methodBind } from "../libs/utils.js";
import { UIBoard } from "./uiBoard.js";

export class UIManager {
	/** @type {HTMLDivElement} */
	boardDiv;
	/** @type {HTMLDivElement} */
	handDiv;
	/** @type {?GameManager} */
	#manager;

	/** @type {?CardBase} */
	selectedInputCard;

	/**
	 * @param {HTMLDivElement} hostWindow
	 */
	constructor(hostWindow) {
		methodBind(this, "ev");
		this.#manager = null;

		this.selectedInputCard = null;

		/** @type {?HTMLDivElement} */
		const mainDiv = hostWindow.querySelector("div.main");
		if (mainDiv == null) throw new Error("Main Div is not found");
		this.boardDiv = mainDiv;

		/** @type {?HTMLDivElement} */
		const handDiv = hostWindow.querySelector("div.hand");
		if (handDiv == null) throw new Error("Hand Div is not found");
		this.handDiv = handDiv;

		this.uiBoard = new UIBoard(this);

		window.addEventListener("resize", this.evUIResize);
	}

	/** @param {GameManager} gameManager */
	bindGameManager(gameManager) {
		this.#manager = gameManager;
		this.#manager.eventSystem.addListener("CARD_DRAW_AFTER", this.evGCardDrawn);
		this.#manager.eventSystem.addListener("CARD_DISCARD_AFTER", this.evGCardDiscarded);
		this.#manager.eventSystem.addListener("HAND_DRAW_AFTER", this.evGHandDrawn);
		this.#manager.eventSystem.addListener("HAND_DISCARD_AFTER", this.evGHandDiscarded);
		this.#manager.eventSystem.addListener("CARD_MOVE", this.evGCardMove);

		this.uiBoard.init();
	}

	/** @type {GameManager} */
	get gameManager() {
		if (this.#manager == null) throw new Error("No gameManager is bound");
		return this.#manager;
	}

	#desableAll() {
		this.gameManager.gameBoard.fullBoard().forEach((boardCell) => {
			const placeholder = this.uiBoard.getPlaceholder(boardCell.pos);
			placeholder.set({ state: "disabled" });
		});
		this.gameManager.gameBoard.fullBoard().forEach((boardCell) => {
			boardCell.card?.uiData.set({ state: "locked" });
		});
	}

	/** @param {InputTargetType} targetType */
	setInteractive(targetType) {
		this.#desableAll();

		switch (targetType) {
			case "ALLY_CARD":
				this.gameManager.gameBoard.allySide().forEach((boardCell) => {
					boardCell.card?.uiData.set({ state: "ready" });
				});
				break;

			case "ENEMY_CARD":
				this.gameManager.gameBoard.enemySide().forEach((boardCell) => {
					boardCell.card?.uiData.set({ state: "ready" });
				});
				break;

			case "ANY_CARD":
				this.gameManager.gameBoard.fullBoard().forEach((boardCell) => {
					boardCell.card?.uiData.set({ state: "ready" });
				});
				break;

			case "ALLY_SIDE":
				this.gameManager.gameBoard.allySide().forEach((boardCell) => {
					if (boardCell.card == null) {
						const placeholder = this.uiBoard.getPlaceholder(boardCell.pos);
						placeholder.set({ state: "enabled" });
					}
				});
				break;

			case "ENEMY_SIDE":
				this.gameManager.gameBoard.enemySide().forEach((boardCell) => {
					if (boardCell.card == null) {
						const placeholder = this.uiBoard.getPlaceholder(boardCell.pos);
						placeholder.set({ state: "enabled" });
					}
				});
				break;

			case "ANY_SIDE":
				this.gameManager.gameBoard.fullBoard().forEach((boardCell) => {
					if (boardCell.card == null) {
						const placeholder = this.uiBoard.getPlaceholder(boardCell.pos);
						placeholder.set({ state: "enabled" });
					}
				});
				break;
		}
	}

	/** @param {CardBase} card */
	selectInputCard(card) {
		this.setInteractive(card.inputTargetType);
		card.uiData.set({ state: "selected" });
		this.selectedInputCard = card;
	}

	deselectInputCard() {
		this.setInteractive("NONE");
		this.selectedInputCard = null;
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

	evUIResize() {
		this.updateUI();
	}

	/** @type {GEV_Listener<"CARD_MOVE">} */
	evGCardMove(event) {
		const card = event.payload.card;
		const dest = event.payload.to;
		if (event.payload.from == "hand") {
			this.uiBoard.boardSelector?.set({ state: "disabled" });
			this.deselectInputCard();
			card.boundPlayer?.removeFromHand(card);

			const boundingRect = card.uiData.container.getBoundingClientRect();
			const pos = new _v(boundingRect.x + boundingRect.width / 2, boundingRect.y + boundingRect.height / 2);

			this.boardDiv.appendChild(card.container);
			card.uiData.set({
				position: pos,
			});
		}
		this.gameManager.gameBoard.placeCard(card, dest);
		this.updateHandUI();
	}

	/** @type {GEV_Listener<"CARD_DRAW_AFTER">} */
	evGCardDrawn(event) {
		const card = event.payload.drawnCard;
		card.uiData.set({ positioning: "none" });
		card.container.style.setProperty("left", "5%");
		card.container.style.setProperty("top", "50%");

		card.uiData.set({ state: "locked" });
		this.handDiv.appendChild(card.container);

		window.setTimeout(() => {
			card.container.style.removeProperty("left");
			card.container.style.removeProperty("top");
			card.uiData.set({ positioning: "hand" });
			this.updateHandUI();
		}, 100);
	}

	/** @type {GEV_Listener<"HAND_DRAW_AFTER">} */
	evGHandDrawn(event) {
		const hand = event.payload.player.hand;

		hand.forEach((card) => {
			card.uiData.set({ state: "ready" });
		});
	}

	/** @type {GEV_Listener<"HAND_DISCARD_AFTER">} */
	evGHandDiscarded(event) {
		console.log("hand discarded");		
	}

	/** @type {GEV_Listener<"CARD_DISCARD_AFTER">} */
	evGCardDiscarded(event) {
		const card = event.payload.discardedCard;

		if (card === this.selectedInputCard) this.deselectInputCard();

		card.container.style.setProperty("left", "95%");
		card.container.style.setProperty("top", "50%");
		card.container.style.setProperty("pointer-events", "none");

		card.uiData.set({ positioning: "none" });

		window.setTimeout(() => {
			card.container.remove();
			card.container.style.removeProperty("left");
			card.container.style.removeProperty("top");
			card.container.style.removeProperty("pointer-events");
		}, 200);
	}
}
