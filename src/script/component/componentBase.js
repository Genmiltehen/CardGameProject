import { methodBind } from "../libs/utils.js";
import { CardBase } from "../card/cardBase.js";

export class ComponentBase {
	/**
	 * @param {CardBase} host
	 * @param {undefined} [data]
	 */
	constructor(host, data) {
		methodBind(this);
		this.host = host;
	}

	/**
	 * @param {Object} values
	 */
	set(values) {}

	setup() {}

	reload() {}
}
