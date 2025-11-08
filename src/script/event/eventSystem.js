export class CardEventSystem {
	/** @type {Map<GEventKey, Set<GEventListener<any>>>} */
	#listenerMap = new Map();

	/**
	 * @template {GEventKey} T
	 * @param {T} eventType
	 * @param {GEventListener<T>} listener
	 */
	addListener(eventType, listener) {
		if (!this.#listenerMap.has(eventType)) this.#listenerMap.set(eventType, new Set());
		this.#listenerMap.get(eventType)?.add(listener);
	}

	/**
	 * @template {GEventKey} T
	 * @param {T} eventType
	 * @param {GEventListener<T>} listener
	 */
	removeListener(eventType, listener) {
		this.#listenerMap.get(eventType)?.delete(listener);
	}

	/** @param {BaseGEvent<any>} event */
	dispatch(event) {
		console.log(event);
		this.#listenerMap.get(event.type)?.forEach((fn) => fn(event));
	}
}

/** @template {GEventKey} T */
export class BaseGEvent {
	/** @readonly @type {T} */ type;
	/** @readonly @type {Object} */ metadata;

	/** @param {T} type */
	constructor(type) {
		this.type = type;
		this.metadata = {};
	}
}

export const GEventTypes = /** @type {const} */ ({
	CARD_TICK: "CARD_TICK",
	HAND_DRAW: "HAND_DRAW",
	HAND_DISCARD: "HAND_DISCARD",
	REQUEST_PLAYER_ACTION: "REQUEST_PLAYER_ACTION",
	START: "START",
	BOARD_TICK: "BOARD_TICK",
	CARD_DRAW: "CARD_DRAW",
	CARD_DISCARD: "CARD_DISCARD",
	CARD_TRANSFER_PLACE: "CARD_TRANSFER_PLACE",
	CARD_TRANSFER_MOVE: "CARD_TRANSFER_MOVE",
	CARD_TRANSFER_SWAP: "CARD_TRANSFER_SWAP",
	LOCK_GUI: "LOCK_GUI",
	UNLOCK_GUI: "UNLOCK_GUI",
	TRIGGER_COUNTER: "TRIGGER_COUNTER",
});

/**
 * @typedef {{
 * [GEventTypes.BOARD_TICK]: BoardTickGEvent
 * [GEventTypes.START]: StartGEvent
 * [GEventTypes.CARD_TICK]: CardTickGEvent
 * [GEventTypes.HAND_DRAW]: HandDrawGEvent
 * [GEventTypes.HAND_DISCARD]: HandDiscardGEvent
 * [GEventTypes.REQUEST_PLAYER_ACTION]: RequesPlayerActionGEvent
 * [GEventTypes.CARD_DRAW]: CardDrawGEvent
 * [GEventTypes.CARD_DISCARD]: CardDiscardGEvent
 * [GEventTypes.CARD_TRANSFER_PLACE]: CardPlaceGEvent
 * [GEventTypes.CARD_TRANSFER_MOVE]: CardMoveGEvent
 * [GEventTypes.CARD_TRANSFER_SWAP]: CardSwapGEvent
 * [GEventTypes.LOCK_GUI]: LockGUIevent
 * [GEventTypes.UNLOCK_GUI]: UnlockGUIevent
 * [GEventTypes.TRIGGER_COUNTER]: CounterGEvent
 * }} __Raw
 */

/** @typedef {__Raw extends {[K in GEventKey] : any} ? __Raw : never} GEventMap */
/** @typedef {typeof GEventTypes[keyof typeof GEventTypes]} GEventKey */

/**
 * @template {GEventKey} T
 * @typedef {(event: GEventMap[T]) => void} GEventListener
 */
