import { methodBind, shuffleArray } from "../libs/utils.js";
import { createGameEvent } from "../manager/eventSystem.js";

export class PlayerFighter {
	/** @type {CardBase[]} */
	hand;
	/** @type {CardBase[]} */
	discardPile;
	/** @type {CardBase[]} */
	drawPile;

	/** @type {number} */
	drawAmount;

	/**  @type {GameManager} */
	manager;

	/**
	 * @param {GameManager} manager
	 * @param {PlayerData} playerData
	 */
	constructor(manager, playerData) {
		methodBind(this);
		this.manager = manager;

		this.hand = [];
		this.drawPile = [];

		this.drawAmount = 6;

		this.discardPile = [];
		for (const cardInitData of playerData.inventory) {
			const card = new cardInitData.cardType(manager);
			for (const componentModifierData of cardInitData.componentModifiersData) {
				const args = componentModifierData.constructorArgs;
				const componentModifier = new componentModifierData.componentType(card, args);
				card.components.add(componentModifier);
			}
			this.discardPile.push(card);
			card.boundPlayer = this;
		}
	}

	//TODOS: leave it be, (probably not finished)

	draw() {
		if (this.drawPile.length < 1) this.moveDiscardToDraw();

		const card = this.drawPile.pop();
		if (card == null) throw new Error("Trying from empty draw pile (probably exhausted inventory)");

		this.hand.push(card);

		const event = createGameEvent("CARD_DRAW_AFTER", { drawnCard: card, player: this });
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
			const event = createGameEvent("HAND_DRAW_AFTER", { player: this });
			this.manager.eventSystem.dispatch(event);
		}
	}

	/** @param {number} [amount]  */
	drawHand(amount) {
		const _n = amount ?? this.drawAmount;
		const time = 500 / _n;
		this.__drawTimeout(_n, time);
	}

	/** @param {CardBase} card  */
	removeFromHand(card) {
		if (!this.hand.includes(card)) throw new Error("Card not in hand to discard");

		this.hand.splice(this.hand.indexOf(card), 1);
	}

	/** @param {CardBase} card */
	discard(card) {
		this.removeFromHand(card);
		this.discardPile.push(card);

		const event = createGameEvent("CARD_DISCARD_AFTER", { discardedCard: card });
		this.manager.eventSystem.dispatch(event);
	}

	/** @param {number} time */
	__discardTimeout(time) {
		const card = this.hand.at(-1);

		if (card != null) {
			this.discard(card);
			window.setTimeout(this.__discardTimeout, time, time);
		} else {
			const event = createGameEvent("HAND_DISCARD_AFTER", { player: this });
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
