import { CardBase } from "./cardBase.js";

export class CardEntity extends CardBase {
	/** @type {?boardPos} */
	pos;

	/**
	 * @param {GameManager} manager
	 * @param {CardBaseInitValues} base
	 */
	constructor(manager, base) {
		super(manager, base);
		this.pos = null;
	}

	/** @returns {boolean} */
	get isEnemy() {
		return this.pos?.col == null ? false : this.pos.col >= this.mgr.gameBoard.dims.col / 2;
	}
}
