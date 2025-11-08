import { BaseGEvent } from "../eventSystem.js";

/**
 * @extends BaseGEvent<"CARD_TICK">
 */
export class CardTickGEvent extends BaseGEvent {
	/** @type {BoardPos} */ pos;
	/** @type {CardEntity} */ target;

	/**
	 * @param {BoardPos} pos
	 * @param {CardEntity} card
	 */
	constructor(pos, card) {
		super("CARD_TICK");
		this.pos = pos;
		this.target = card;
	}
}
