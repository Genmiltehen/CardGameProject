/** @enum {string} */
export const GEventTypes = /** @type {const} */ ({
	// Tick Events
	CARD_TICK: "CARD_TICK",
	// Player Events
	HAND_DRAW_: "HAND_DRAW",
	HAND_DISCARD: "HAND_DISCARD",
	REQUEST_PLAYER_ACTION: "REQUEST_PLAYER_ACTION",
	// Card Interaction Events
	CARD_DRAW: "CARD_DRAW", 
	CARD_DISCARD: "CARD_DISCARD",
	// Card Transfer Events
	CARD_TRANSFER_PLACE: "CARD_TRANSFER_PLACE",
	CARD_TRANSFER_MOVE: "CARD_TRANSFER_MOVE",
	CARD_TRANSFER_SWAP: "CARD_TRANSFER_SWAP",
	// Manager Events
	START: "START",
	BOARD_TICK: "BOARD_TICK",
	// GUI EVENTS
	LOCK_GUI: "LOCK_GUI",
	UNLOCK_GUI: "UNLOCK_GUI",
	// TRIGGER EVENTS
	TRIGGER_COUNTER: "TRIGGER_COUNTER",
});

/** @typedef {typeof GEventTypes[keyof typeof GEventTypes]} GEventKey */

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
