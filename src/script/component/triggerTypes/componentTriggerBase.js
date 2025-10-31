import { methodBind } from "../../libs/utils.js";
import { ComponentBase } from "../componentBase.js";

export class componentTriggerBase extends ComponentBase {
	/**
	 * @constructor
	 * @param {CardEntity} host
	 * @param {undefined} [data]
	 */
	constructor(host, data) {
		super(host);
		methodBind(this);
	}

	/**
	 * @abstract
	 * @param {Object} values
	 */
	set(values) {}
}
