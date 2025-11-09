import { BaseGEvent, GEventTypes } from "../eventBase.js";

/**
 * @template {GEventKey} T
 * @extends BaseGEvent<T>
 */
export class PlayerGEvent extends BaseGEvent {
	/** @type {PlayerFighter} */ player;

	/**
	 * @param {T} type
	 * @param {PlayerFighter} player
	 */
	constructor(type, player) {
		super(type);
		this.player = player;
	}
}

/** @extends PlayerGEvent<typeof GEventTypes.HAND_DRAW_> */
export class HandDrawGEvent extends PlayerGEvent {
	/** @param {PlayerFighter} player */
	constructor(player) {
		super(GEventTypes.HAND_DRAW_, player);
	}
}

/** @extends PlayerGEvent<typeof GEventTypes.HAND_DISCARD> */
export class HandDiscardGEvent extends PlayerGEvent {
	/** @param {PlayerFighter} player */
	constructor(player) {
		super(GEventTypes.HAND_DISCARD, player);
	}
}

/** @extends PlayerGEvent<typeof GEventTypes.REQUEST_PLAYER_ACTION> */
export class RequesPlayerActionGEvent extends PlayerGEvent {
	/** @param {PlayerFighter} player */
	constructor(player) {
		super(GEventTypes.REQUEST_PLAYER_ACTION, player);
	}
}
