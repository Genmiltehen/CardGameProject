import { BaseGEvent } from "../eventSystem.js";

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
