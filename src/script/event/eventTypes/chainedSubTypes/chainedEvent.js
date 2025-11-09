import { BaseGEvent, GEventTypes } from "../../eventBase";

/**
 * @typedef {Subset<GEventKey, [
 * 	typeof GEventTypes.BOARD_TICK,
 *  typeof GEventTypes.TRIGGER_COUNTER
 * ]>} ChainedGEventKeys
 */

/**
 * @template {ChainedGEventKeys} T
 * @typedef {(
 *   T extends keyof typeof nextMap
 *     ? nextMap[T] extends ChainedGEventKeys
 *       ? nextMap[T]
 *       : null
 *     : null
 * )} NextEventKey
 */

const nextMap = {
	[GEventTypes.BOARD_TICK]: GEventTypes.TRIGGER_COUNTER,
	[GEventTypes.TRIGGER_COUNTER]: null,
};

/**
 * @template {ChainedGEventKeys} T
 * @typedef {NextEventKey<T> extends ChainedGEventKeys ? ChainedGEvent<NextEventKey<T>> : null} NextEventType
 */

/**
 * @template {ChainedGEventKeys} T
 * @extends BaseGEvent<T>
 */
export class ChainedGEvent extends BaseGEvent {
	/** @type {Object} */ data;

	/**
	 * @param {T} type
	 * @param {Object} data
	 */
	constructor(type, data) {
		super(type);
		this.data = data;
	}

	/**
	 * @readonly
	 * @type {NextEventType<T> | null}
	 */
	get nextEvent() {
		const nextType = nextMap[this.type];
		if (nextType == null) return null;
		return /** @type {NextEventType<T>} */ (new ChainedGEvent(nextType, this.data));
	}
}
