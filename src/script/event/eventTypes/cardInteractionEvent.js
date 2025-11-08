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
