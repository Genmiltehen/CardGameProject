export class CardEventSystem {
	/** @type {Map<keyof GEV_DataMap, GEV_Listener<any>[]>} */
	#listenerMap = new Map();

	/**
	 * @template {keyof GEV_DataMap} T
	 * @param {T} eventType
	 * @param {GEV_Listener<T>} listener
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
	 * @template {keyof GEV_DataMap} T
	 * @param {T} eventType
	 * @param {GEV_Listener<T>} listener
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
	 * @param {GEV_Event<any>} event
	 */
	dispatch(event) {
		const eventListeners = this.#listenerMap.get(event.type) || [];
		for (const callback of eventListeners) {
			callback(event);
		}
	}
}

/**
 * Creates a game event with type-safe data based on the event type
 * @template {keyof GEV_DataMap} T
 * @param {T} event_type
 * @param {GEV_DataMap[T]} event_data
 * @returns {GEV_Event<T>}
 */
export function createGameEvent(event_type, event_data) {
	return {
		type: event_type,
		payload: event_data,
	};
}
