import { BaseGEvent, GEventTypes } from "../event/index.js";

/**
 * @typedef {Subset<GEventKey, [
 * typeof GEventTypes.TRIGGER_COUNTER
 * ]>} ComponentBGEventKeys
 */

/**
 * @template {ComponentBGEventKeys} T
 * @extends BaseGEvent<T>
 */
export class ComponentBGEvent extends BaseGEvent {
	/** @readonly @type {ComponentBase} */ component;

	/**
	 * @param {T} type
	 * @param {ComponentBase} component
	 */
	constructor(type, component) {
		super(type);
		this.component = component;
	}
}
