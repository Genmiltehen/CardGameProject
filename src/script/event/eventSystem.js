import { BaseGEvent, GEventTypes } from "./eventBase.js";

import { CardTickGEvent } from "./eventTypes/cardTickEvent.js";
import { HandDiscardGEvent, HandDrawGEvent, RequesPlayerActionGEvent } from "./eventTypes/playerEvent.js";
import { CardDiscardGEvent, CardDrawGEvent } from "./eventTypes/cardInteractionEvent.js";
import { CardMoveGEvent } from "./eventTypes/cardTransferSubtypes/cardMoveEvent.js";
import { CardPlaceGEvent } from "./eventTypes/cardTransferSubtypes/cardPlaceEvent.js";
import { CardSwapGEvent } from "./eventTypes/cardTransferSubtypes/cardSwapEvent.js";
import { BoardTickGEvent, StartGEvent } from "./eventTypes/managerSubtypes/managerEvent.js";
import { LockGUIevent, UnlockGUIevent } from "./eventTypes/managerSubtypes/guiEvent.js";
import { CounterGEvent } from "../component/triggerTypes/triggerEvents.js";

export const GEventMap = {
	// Tick Event
	[GEventTypes.CARD_TICK]: CardTickGEvent,
	// Player Events
	[GEventTypes.HAND_DRAW_]: HandDrawGEvent,
	[GEventTypes.HAND_DISCARD]: HandDiscardGEvent,
	[GEventTypes.REQUEST_PLAYER_ACTION]: RequesPlayerActionGEvent,
	// Card Interaction Events
	[GEventTypes.CARD_DRAW]: CardDrawGEvent,
	[GEventTypes.CARD_DISCARD]: CardDiscardGEvent,
	// Card Transfer Events
	[GEventTypes.CARD_TRANSFER_PLACE]: CardPlaceGEvent,
	[GEventTypes.CARD_TRANSFER_MOVE]: CardMoveGEvent,
	[GEventTypes.CARD_TRANSFER_SWAP]: CardSwapGEvent,
	// Manager Events
	[GEventTypes.START]: StartGEvent,
	[GEventTypes.BOARD_TICK]: BoardTickGEvent,
	// GUI EVENTS
	[GEventTypes.LOCK_GUI]: LockGUIevent,
	[GEventTypes.UNLOCK_GUI]: UnlockGUIevent,
	// TRIGGER EVENTS
	[GEventTypes.TRIGGER_COUNTER]: CounterGEvent,
};

/**
 * @template {GEventKey} T
 * @typedef {(event: InstanceType<GEventMap[T]>) => void} GEventListener
 */

/**
 * @template {GEventKey} T
 * @typedef {{
 * 	context: string
 * 	listener: GEventListener<T>
 * }} GEListenerCtxBundle
 */

export class GEventSystem {
	/** @type {Map<GEventKey, Set<GEListenerCtxBundle<any>>>} */
	#listenerMap = new Map();
	/** @type {WeakMap<Object,string>} */
	#contextIds = new WeakMap();
	#nextId = 0;

	/**
	 * @param {Object} obj
	 * @returns {string}
	 */
	getContextId(obj) {
		if (!this.#contextIds.has(obj)) {
			this.#contextIds.set(obj, `contx_${this.#nextId++}`);
		}
		if (this.#contextIds.get(obj) == null) console.info("strange");
		return this.#contextIds.get(obj) ?? "global";
	}

	/**
	 * @template {GEventKey} T
	 * @param {T} eventType
	 * @param {GEventListener<T>} listener
	 * @param {Object | "global"} [context="global"]
	 */
	addListener(eventType, listener, context = "global") {
		const strContext = context !== "global" ? this.getContextId(context) : "global";
		if (!this.#listenerMap.has(eventType)) this.#listenerMap.set(eventType, new Set());
		/** @type {GEListenerCtxBundle<T>} */
		const listenerCtx = {
			context: strContext,
			listener: listener,
		};
		this.#listenerMap.get(eventType)?.add(listenerCtx);
	}

	/**
	 * @template {GEventKey} T
	 * @param {T} eventType
	 * @param {GEventListener<T>} listener
	 * @param {Object | "global"} [context="global"]
	 */
	removeListener(eventType, listener, context = "global") {
		const strContext = context !== "global" ? this.getContextId(context) : "global";
		/** @type {GEListenerCtxBundle<T>} */
		const listenerCtx = {
			context: strContext,
			listener: listener,
		};
		this.#listenerMap.get(eventType)?.delete(listenerCtx);
	}

	/**
	 * @param {BaseGEvent<any>} event
	 * @param {Object | "global"} [context="global"]
	 */
	dispatch(event, context = "global") {
		const strContext = context !== "global" ? this.getContextId(context) : "global";
		console.log(context, event);
		const listenerContexts = Array.from(this.#listenerMap.get(event.type) ?? []);
		const filteredListenerContexts = listenerContexts.filter((bundle) => {
			return bundle.context == "global" || bundle.context == strContext;
		});
		if (filteredListenerContexts.length > 0) {
			filteredListenerContexts?.forEach((ctx) => ctx.listener(event));
		} else {
		}
	}
}
