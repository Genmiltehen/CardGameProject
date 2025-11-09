import { GEventTypes } from "../../event/eventBase.js";
import { ComponentBGEvent } from "../componentBaseEvent.js";

/**
 * @typedef {Subset<ComponentBGEventKeys, [
 * typeof GEventTypes.TRIGGER_COUNTER
 * ]>} TriggerBGEventKeys
 */

/**
 * @template {TriggerBGEventKeys} T
 * @extends ComponentBGEvent<T>
 */
class TriggerBaseGEvent extends ComponentBGEvent {
	/** @readonly @type {ComponentTriggerBase} */ component;

	/**
	 * @param {T} type
	 * @param {ComponentTriggerBase} component
	 */
	constructor(type, component) {
		super(type, component);
		this.component = component;
	}
}

/** @extends TriggerBaseGEvent<typeof GEventTypes.TRIGGER_COUNTER> */
export class CounterGEvent extends TriggerBaseGEvent {
	/** @readonly @type {ComponentTriggerCounter} */ component;

	/** @param {ComponentTriggerCounter} component */
	constructor(component) {
		super(GEventTypes.TRIGGER_COUNTER, component);
		this.component = component;
	}
}
