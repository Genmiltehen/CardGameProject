import { CardBase } from "./cardBase.js";

/**
 * @template {PlayerID} [PID=any]
 * @extends CardBase<PID>
 */
export class CardEntity extends CardBase {
	/** @type {?BoardPos} */
	pos;

	/**
	 * @param {GameManager} manager
	 * @param {CardBaseInitValues<PID>} base
	 */
	constructor(manager, base) {
		super(manager, base);
		this.pos = null;
	}

	/** @returns {boolean} */
	get isEnemy() {
		return this.pos?.col == null ? false : this.pos.col >= this.manager.gameBoard.dims.col / 2;
	}
}
