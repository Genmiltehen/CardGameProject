export class CardEventSystem {
	/** @type {Map<keyof EventDataMap, EV_CallbackEventListener<any>[]>} */
	#listenerMap = new Map();

	/**
	 * @template {keyof EventDataMap} T
	 * @param {T} eventType
	 * @param {EV_CallbackEventListener<T>} listener
	 */
	addListener(eventType, listener) {
		if (!this.#listenerMap.has(eventType)) {
			this.#listenerMap.set(eventType, []);
		}
		const listeners = this.#listenerMap.get(eventType);
		if (listeners == null) throw new Error("[Listener array doesn't exist after initialization]");
		listeners.push(listener);
	}

	/**
	 * @template {keyof EventDataMap} T
	 * @param {T} eventType
	 * @param {EV_CallbackEventListener<T>} listener
	 */
	removeListener(eventType, listener) {
		const listeners = this.#listenerMap.get(eventType);
		if (listeners == null) {
			const msg = `there is no listener for event type ${eventType}`;
			throw new Error(msg);
		}
		listeners.splice(listeners.indexOf(listener), 1);
	}

	/**
	 * @param {EV_GameEvent<any>} event
	 */
	dispatchEvent(event) {
		const eventListeners = this.#listenerMap.get(event.type) || [];
		for (const callback of eventListeners) {
			callback(event);
		}
	}
}

/**
 * Creates a game event with type-safe data based on the event type
 * @template {keyof EventDataMap} T
 * @param {T} event_type
 * @param {EventDataMap[T]} event_data
 * @returns {EV_GameEvent<T>}
 */
export function createGameEvent(event_type, event_data) {
	return {
		type: event_type,
		data: event_data,
	};
}
