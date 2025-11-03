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
		}
	}

	//TODOS: leave it be, (probably not finished)

	draw() {
		if (this.drawPile.length < 1) {
			this.moveDiscardToDraw();
		}
		const card = this.drawPile.pop();
		if (card != null) {
			this.hand.push(card);

			const event = createGameEvent("CARD_DRAWN", { drawnCard: card, player: this });
			this.manager.eventSystem.dispatchEvent(event);
		}
	}

	/** @param {number} n */
	__drawTimeout(n) {
		if (n > 0) {
			this.draw();
			window.setTimeout(this.__drawTimeout, 100, n - 1);
		}
	}

	drawHand() {
		this.__drawTimeout(this.drawAmount);
	}

	/** @param {CardBase} card */
	discard(card) {
		if (!this.hand.includes(card)) throw new Error("Card not in hand to discard");

		this.hand.splice(this.hand.indexOf(card), 1);
		this.discardPile.push(card);

		const event = createGameEvent("CARD_DISCARDED", { discardedCard: card });
		this.manager.eventSystem.dispatchEvent(event);
	}

	__discardTimeout() {
		const card = this.hand.at(-1);
				
		if (card != null) {
			this.discard(card);
			window.setTimeout(this.__discardTimeout, 100);
		}
	}

	discardHand() {
		this.__discardTimeout();
	}

	moveDiscardToDraw() {
		shuffleArray(this.discardPile);

		let card;
		while ((card = this.discardPile.pop())) this.drawPile.push(card);
	}
}
