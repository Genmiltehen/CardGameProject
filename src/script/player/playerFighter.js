import { CardInteractionGEvent, PlayerGEvent } from "../event/index.js";
import { GEventTypes } from "../event/eventSystem.js";
import { methodBind, shuffleArray } from "../libs/utils.js";

/** @template {PlayerID} T */
export class PlayerFighter {
	/** @readonly @type {CardBase<T>[]} */
	cards;
	/** @type {CardBase<T>[]} */
	hand;
	/** @type {CardBase<T>[]} */
	discardPile;
	/** @type {CardBase<T>[]} */
	drawPile;

	/** @type {number} */
	drawAmount;
	/** @type {T} */
	playerId;

	/**  @type {GameManager} */
	manager;

	/**
	 * @param {GameManager} manager
	 * @param {T} playerID
	 * @param {PlayerData<T>} playerData
	 */
	constructor(manager, playerID, playerData) {
		methodBind(this);
		this.manager = manager;

		this.drawAmount = 6;
		this.playerId = playerID;

		this.cards = [];
		for (const cardInitData of playerData.inventory) {
			const card = new cardInitData.cardType(manager, playerID);
			for (const componentModifierData of cardInitData.componentModifiersData) {
				const args = componentModifierData.constructorArgs;
				const componentModifier = new componentModifierData.componentType(card, args);
				card.components.add(componentModifier);
			}
			this.cards.push(card);
		}

		this.hand = [];
		this.drawPile = [];
		this.discardPile = [];
		this.cards.forEach((card) => {
			this.discardPile.push(card);
		});
	}
	
	//TODO: leave it be, (probably not finished)

	draw() {
		if (this.drawPile.length < 1) this.moveDiscardToDraw();

		const card = this.drawPile.pop();
		if (card == null) throw new Error("Trying from empty draw pile (probably exhausted inventory)");

		this.hand.push(card);

		const event = new CardInteractionGEvent(GEventTypes.CARD_DRAW, card, this);
		this.manager.eventSystem.dispatch(event);
	}

	/**
	 * @param {number} cardNumber
	 * @param {number} time
	 */
	__drawTimeout(cardNumber, time) {
		if (cardNumber > 0) {
			this.draw();
			window.setTimeout(this.__drawTimeout, time, cardNumber - 1, time);
		} else {
			const event = new PlayerGEvent(GEventTypes.HAND_DRAW, this);
			this.manager.eventSystem.dispatch(event);
		}
	}

	/** @param {number} [amount]  */
	drawHand(amount) {
		const _n = amount ?? this.drawAmount;
		const time = 500 / _n;
		this.__drawTimeout(_n, time);
	}

	/** @param {CardBase<T>} card  */
	removeFromHand(card) {
		if (!this.hand.includes(card)) throw new Error("Card not in hand to discard");

		this.hand.splice(this.hand.indexOf(card), 1);
	}

	/** @param {CardBase<T>} card */
	discard(card) {
		this.removeFromHand(card);
		this.discardPile.push(card);

		const event = new CardInteractionGEvent(GEventTypes.CARD_DISCARD, card, this);
		this.manager.eventSystem.dispatch(event);
	}

	/** @param {number} time */
	__discardTimeout(time) {
		const card = this.hand.at(-1);

		if (card != null) {
			this.discard(card);
			window.setTimeout(this.__discardTimeout, time, time);
		} else {
			const event = new PlayerGEvent(GEventTypes.HAND_DISCARD, this);
			this.manager.eventSystem.dispatch(event);
		}
	}

	discardHand() {
		const time = 500 / this.hand.length;
		if (time != Infinity) this.__discardTimeout(time);
	}

	moveDiscardToDraw() {
		shuffleArray(this.discardPile);

		let card;
		while ((card = this.discardPile.pop())) this.drawPile.push(card);
	}
}
