import { shuffleArray } from "../libs/utils.js";
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
		const card = this.drawPile.pop();
		if (card != null) {
			const event = createGameEvent("CARD_DRAWN", { drawnCard: card, player: this });
			this.manager.eventSystem.dispatchEvent(event);

			this.hand.push(card);
		}
	}

	drawHand() {
		for (let i = 0; i < this.drawAmount; i++) this.draw();
	}

	/** @param {CardBase} card */
	discard(card) {
		if (!this.discardPile.includes(card)) throw new Error("Card not in hand to discard");

		this.discardPile.splice(this.discardPile.indexOf(card), 1);

		const event = createGameEvent("CARD_DISCARDED", { discardedCard: card });
		this.manager.eventSystem.dispatchEvent(event);

		this.drawPile.push(card);
	}

	discardHand() {
		let card;
		while ((card = this.discardPile.pop())) this.discard(card);
	}

	moveDiscardToDraw() {
		shuffleArray(this.discardPile);

		let card;
		while ((card = this.discardPile.pop())) this.drawPile.push(card);
	}
}
