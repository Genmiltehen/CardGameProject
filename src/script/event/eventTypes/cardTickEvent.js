import { BaseGEvent, GEventTypes } from "../eventBase.js";

/** @extends BaseGEvent<typeof GEventTypes.CARD_TICK> */
export class CardTickGEvent extends BaseGEvent {
	/** @type {BoardPos} */ pos;
	/** @type {CardEntity} */ target;

	/**
	 * @param {BoardPos} pos
	 * @param {CardEntity} card
	 */
	constructor(pos, card) {
		super(GEventTypes.CARD_TICK);
		this.pos = pos;
		this.target = card;
	}
}
