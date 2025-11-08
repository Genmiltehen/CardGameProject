import { GEventTypes } from "../event/eventSystem.js";
import { GUIEvent } from "../event/index.js";
import { _v } from "../libs/_v.js";
import { methodBind } from "../libs/utils.js";
import { commonIS } from "./helperUtils.js";
import { UIBoard } from "./uiBoard.js";

/** @template {PlayerID} [T=any] */
export class UIManager {
	/** @type {HTMLDivElement} */
	boardDiv;
	/** @type {HTMLDivElement} */
	handDiv;
	/** @type {?GameManager} */
	#manager;
	/** @type {?PlayerFighter<T>} */
	player;

	/** @type {?CardBase<T>} */
	selectedInputCard;

	/**
	 * @param {HTMLDivElement} hostWindow
	 */
	constructor(hostWindow) {
		methodBind(this, "ev");
		this.#manager = null;

		this.selectedInputCard = null;
		this.player = null;

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

	/**
	 * @param {GameManager} gameManager
	 * @param {T} playerId
	 */
	bindGameManager(gameManager, playerId) {
		this.#manager = gameManager;
		if (playerId == "enemy") throw new Error("UNIMPLEMENTED [Multiplayer]");
		this.player = gameManager.players[playerId];
		this.player.cards.forEach((card) => {
			card.playerId = playerId;
		});

		this.#manager.eventSystem.addListener(GEventTypes.UNLOCK_GUI, this.evGUnlockGUIevent);
		this.#manager.eventSystem.addListener(GEventTypes.LOCK_GUI, this.evGLockGUIevent);

		this.#manager.eventSystem.addListener(GEventTypes.CARD_TRANSFER_SWAP, this.evGCardSwap);
		this.#manager.eventSystem.addListener(GEventTypes.CARD_TRANSFER_MOVE, this.evGCardMove);
		this.#manager.eventSystem.addListener(GEventTypes.CARD_TRANSFER_PLACE, this.evGCardPlace);

		this.#manager.eventSystem.addListener(GEventTypes.CARD_DRAW, this.evGCardDraw);
		this.#manager.eventSystem.addListener(GEventTypes.CARD_DISCARD, this.evGCardDiscarded);

		this.#manager.eventSystem.addListener(GEventTypes.HAND_DRAW, this.evGHandDraw);
		this.#manager.eventSystem.addListener(GEventTypes.HAND_DISCARD, this.evGHandDiscard);

		this.uiBoard.init();
	}

	/** @type {GameManager} */
	get gameManager() {
		if (this.#manager == null) throw new Error("No gameManager is bound");
		return this.#manager;
	}

	/** @param {InteractivitySelector} intSelector */
	#processSetUIState(intSelector) {
		const state = intSelector.state == "enabled";
		/** @type {import("../card/cardUI.js").cardState} */
		const cardState = state ? "ready" : "locked";
		/** @type {import("./uiBoard.js").PCEState} */
		const pceState = state ? "enabled" : "disabled";

		if (intSelector.area == "HAND_CARDS") {
			if (this.player == null) throw new Error("Player is not bound");
			const hand = this.player.hand;
			if (intSelector.player == "ALLY") hand.forEach((card) => card.uiData.set({ state: cardState }));
		}

		const gBoard = this.gameManager.gameBoard;

		/** @type {BoardCell[]} */
		let boardPart = [];
		if (intSelector.player == "ALLY") boardPart = gBoard.allySide();
		if (intSelector.player == "ENEMY") boardPart = gBoard.enemySide();

		/** @type {(boardCell: BoardCell) => void} */
		let handler = (_) => {};
		if (intSelector.area == "BOARD_CARDS")
			handler = (bC) => {
				bC.card?.uiData.set({ state: cardState });
			};
		if (intSelector.area == "PLACEHOLDERS")
			handler = (bC) => {
				if (bC.card == null) {
					this.uiBoard.getPlaceholder(bC.pos).set({ state: pceState });
				}
			};
		boardPart.forEach(handler);
	}

	/** @param {InteractivitySelector[]} interactivitySelectors */
	setUIState(interactivitySelectors) {
		interactivitySelectors.forEach((IS) => this.#processSetUIState(IS));
	}

	lockGUI() {
		const event = new GUIEvent(GEventTypes.LOCK_GUI, this.gameManager, this);
		this.gameManager.eventSystem.dispatch(event);
	}

	unlockGUI() {
		const event = new GUIEvent(GEventTypes.UNLOCK_GUI, this.gameManager, this);
		this.gameManager.eventSystem.dispatch(event);
	}

	/** @param {CardBase<T>} card */
	setInputCard(card) {
		this.clearInputCard();
		this.selectedInputCard = card;
		card.uiData.set({ state: "selected" });
	}

	clearInputCard() {
		this.selectedInputCard = null;
	}

	updateUI() {
		this.uiBoard.updateUI();
		this.updateHandUI();
	}

	updateHandUI() {
		if (this.player == null) throw new Error("Game Manager is not bound");
		const hand = this.player.hand;
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

	/** @param {LockGUIevent} event  */
	evGLockGUIevent(event) {
		this.setUIState(commonIS.offAll);
		this.uiBoard.boardSelector?.set({ state: "disabled" });
	}

	/** @param {UnlockGUIevent} event  */
	evGUnlockGUIevent(event) {
		this.setUIState(commonIS.onAllyCards);
	}

	/** @param {CardSwapGEvent} event */
	evGCardSwap(event) {
		const card1 = event.source;
		const card2 = event.destination;

		this.uiBoard.boardSelector?.set({ state: "disabled" });
		this.clearInputCard();

		this.gameManager.gameBoard.swapCards(card1, card2);

		const unlockGUIEvent = new GUIEvent(GEventTypes.UNLOCK_GUI, this.gameManager, this);
		this.gameManager.eventSystem.dispatch(unlockGUIEvent);
	}

	/** @param {CardMoveGEvent} event */
	evGCardMove(event) {
		const card = event.card;
		const dest = event.destination;

		this.uiBoard.boardSelector?.set({ state: "disabled" });
		this.clearInputCard();

		this.lockGUI();

		this.gameManager.gameBoard.placeCard(card, dest);

		const unlockGUIEvent = new GUIEvent(GEventTypes.UNLOCK_GUI, this.gameManager, this);
		this.gameManager.eventSystem.dispatch(unlockGUIEvent);
	}

	/** @param {CardPlaceGEvent} event */
	evGCardPlace(event) {
		const card = event.card;
		const dest = event.destination;

		this.uiBoard.boardSelector?.set({ state: "disabled" });
		this.clearInputCard();
		this.setUIState(commonIS.offAll);

		event.source.removeFromHand(card);
		const boundingRect = card.uiData.container.getBoundingClientRect();
		const pos = new _v(boundingRect.x + boundingRect.width / 2, boundingRect.y + boundingRect.height / 2);
		this.boardDiv.appendChild(card.container);
		card.uiData.set({
			position: pos,
		});

		this.gameManager.gameBoard.placeCard(card, dest);
		this.updateHandUI();
	}

	/** @param {CardInteractionGEvent<typeof GEventTypes.CARD_DRAW>} event */
	evGCardDraw(event) {
		const card = event.card;
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

	/** @type {GEventListener<typeof GEventTypes.CARD_DISCARD>}  */
	evGCardDiscarded(event) {
		const card = event.card;

		if (card === this.selectedInputCard) {
			this.clearInputCard();
		}

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

	/** @param {PlayerGEvent<typeof GEventTypes.HAND_DRAW>} event */
	evGHandDraw(event) {
		const hand = event.player.hand;

		hand.forEach((card) => {
			card.uiData.set({ state: "ready" });
		});
	}

	/** @param {PlayerGEvent<typeof GEventTypes.HAND_DISCARD>} event */
	evGHandDiscard(event) {
		console.log("hand discarded");
	}
}
