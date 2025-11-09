import { ComponentBase } from "../componentBase.js";
import { clamp, methodBind } from "../../libs/utils.js";
import { CardBase } from "../../card/cardBase.js";

export class ComponentHealthBase extends ComponentBase {
	/** @type {number} */
	maximum;
	/** @type {number} */
	current;

	/**
	 * @param {CardBase} host
	 * @param {{maxHealth: number}} data
	 */
	constructor(host, data) {
		super(host);
		methodBind(this);
		this.maximum = data.maxHealth;
		this.current = data.maxHealth;
	}

	/**
	 * @param {{
	 * 	maximum?: number,
	 * 	current?: number
	 * }} values
	 */
	set(values) {
		if (values.current != null) {
			this.current = clamp(values.current, 0, this.maximum);
		}
		if (values.maximum != null) {
			this.maximum = values.maximum;
			this.current = clamp(this.current, 0, this.maximum);
		}
	}

	/**
	 * @param {number} value if negative - damage, else - healing
	 * @returns {{lethal: boolean, fullHealth: boolean}}
	 */
	modifyHealth(value) {
		return {
			lethal: false,
			fullHealth: false,
		};
	}
}
