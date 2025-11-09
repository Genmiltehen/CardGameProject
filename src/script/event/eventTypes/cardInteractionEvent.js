import { GEventTypes } from "../eventBase.js";
import { PlayerGEvent } from "./playerEvent.js";

/**
 * @template {GEventKey} GEKey
 * @extends PlayerGEvent<GEKey>
 */
export class CardInteractionGEvent extends PlayerGEvent {
	/** @type {CardBase} */ card;

	/**
	 * @param {GEKey} type
	 * @param {CardBase} card
	 * @param {PlayerFighter} player
	 */
	constructor(type, card, player) {
		super(type, player);
		this.card = card;
		this.player = player;
	}
}

/** @extends CardInteractionGEvent<typeof GEventTypes.CARD_DRAW> */
export class CardDrawGEvent extends CardInteractionGEvent {
	/** @type {CardBase} */ card;

	/**
	 * @param {CardBase} card
	 * @param {PlayerFighter} player
	 */
	constructor(card, player) {
		super(GEventTypes.CARD_DRAW, card, player);
		this.card = card;
		this.player = player;
	}
}

/** @extends CardInteractionGEvent<typeof GEventTypes.CARD_DISCARD> */
export class CardDiscardGEvent extends CardInteractionGEvent {
	/** @type {CardBase} */ card;

	/**
	 * @param {CardBase} card
	 * @param {PlayerFighter} player
	 */
	constructor(card, player) {
		super(GEventTypes.CARD_DISCARD, card, player);
		this.card = card;
		this.player = player;
	}
}
