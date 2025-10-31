import { shuffleArray } from "../libs/utils.js";

export class PlayerFighter {
	/** @type {CardBase[]} */
	hand;
	/** @type {CardBase[]} */
	discardPile;
	/** @type {CardBase[]} */
	drawPile;

	/** @type {number} */
	drawAmount;

	/**  @type {Manager} */
	manager;

	/**
	 * @param {Manager} manager
	 * @param {PlayerData} playerData
	 */
	constructor(manager, playerData) {
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
		}
	}

	//TODOS: leave it be, (probably not finished)

	draw() {
		if (this.drawPile.length < 1) {
			this.moveDiscardToDraw();
		}

		/** @type {EV_GameEvent} */
		const event = {
			source: this,
			data: {},
		};
		this.manager.eventSystem.dispatchEvent("CARD_DRAWN", event);

		const card = this.drawPile.pop();
		if (card != null) this.hand.push(card);
	}

	drawHand() {
		for (let i = 0; i < this.drawAmount; i++) this.draw();
	}

	/** @param {CardBase} card */
	discard(card) {
		if (!this.discardPile.includes(card)) throw new Error("Card not in hand to discard");

		this.discardPile.splice(this.discardPile.indexOf(card), 1);

		/** @type {EV_GameEvent} */
		const event = {
			source: this,
			data: { card: card },
		};
		this.manager.eventSystem.dispatchEvent("CARD_DISCARDED", event);

		this.drawPile.push(card);
	}

	discardHand() {
		let card;
		while ((card = this.discardPile.pop())) this.discard(card);
	}

	moveDiscardToDraw() {
		shuffleArray(this.discardPile);

		const len = this.discardPile.length;
		for (let i = 0; i < len; i++) {
			const card = this.discardPile.pop();
			if (card != null) this.drawPile.push(card);
		}
	}
}
