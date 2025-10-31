export class CardEventSystem {
	/** @type {Map<eventType, EV_CallbackEventListener[]>} */
	#listenerMap = new Map();

	/**
	 * @param {eventType} eventType
	 * @param {EV_CallbackEventListener} listener
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
	 * @param {eventType} eventType
	 * @param {EV_CallbackEventListener} callback
	 */
	removeListener(eventType, callback) {
		const listeners = this.#listenerMap.get(eventType);
		if (listeners == null) {
			const msg = `there is no listener for event type ${eventType}`;
			throw new Error(msg);
		}
		listeners.splice(listeners.indexOf(callback), 1);
	}

	/**
	 * @param {eventType} eventType
	 * @param {EV_GameEvent} event
	 */
	dispatchEvent(eventType, event) {
		const eventListeners = this.#listenerMap.get(eventType) || [];
		for (const callback of eventListeners) {
			callback(event);
		}
	}
}
