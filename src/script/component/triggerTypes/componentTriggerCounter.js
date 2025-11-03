import { ProgressBarSteps } from "../../libs/ui/progressBarTicks/progressBarTicks.js";
import { createElement, methodBind, clamp } from "../../libs/utils.js";
import { createGameEvent } from "../../manager/eventSystem.js";
import { componentTriggerBase } from "./componentTriggerBase.js";

export class ComponentTriggerCounter extends componentTriggerBase {
	/** @type {number} */
	maximum;
	/** @type {number} */
	current;

	/** @type {HTMLDivElement} */
	#mainContainer;
	/** @type {ProgressBarSteps} */
	#bar;

	/**
	 * @constructor
	 * @param {CardEntity} host
	 * @param {{maxCounter: number}} data
	 */
	constructor(host, data) {
		super(host);
		methodBind(this);

		this.maximum = data.maxCounter;
		this.current = 0;

		// @ts-ignore
		this.#mainContainer = createElement("div.counterTrigger_c");
		this.#bar = new ProgressBarSteps(this.#mainContainer, data.maxCounter, "horizontal");
		this.#bar.set({
			primaryColor: [227, 191, 14],
			secondaryColor: [71, 61, 0],
		});

		/** @type {?HTMLDivElement} */
		const hostContainer = this.host.container.querySelector("div.cardInsHolder");
		if (hostContainer == null) throw new Error("How? [host card has no conrainer]");
		hostContainer.appendChild(this.#mainContainer);
	}

	/**
	 * @param {{
	 * 	maximum?: number,
	 * 	current?: number
	 * }} values
	 */
	set(values) {
		if (values.current != null) {
			this.current = clamp(values.current, 0, this.maximum);
			this.#bar.set({
				value: this.current,
			});
		}
		if (values.maximum != null) {
			this.maximum = values.maximum;
			this.current = clamp(this.current, 0, this.maximum);
			this.#bar.set({
				maxValue: this.maximum,
			});
		}
	}

	advance() {
		this.set({
			current: this.current + 1,
		});
		if (this.current == this.maximum) {
			const event = createGameEvent("TRIGGER_COUNTER", { counter: this });
			this.host.mgr.eventSystem.dispatchEvent(event)
		}
	}
}
