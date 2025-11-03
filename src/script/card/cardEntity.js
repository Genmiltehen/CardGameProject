import { CardBase } from "./cardBase.js";

export class CardEntity extends CardBase {
	/** @type {?import("../libs/utils.js").boardPos} */
	cardBoardPosition;
	
	/**
	 * @param {GameManager} manager
	 * @param {import("./cardBase.js").CardBaseInitValues} base
	 */
	constructor(manager, base) {
		super(manager, base);
		this.cardBoardPosition = null;
	}
}
