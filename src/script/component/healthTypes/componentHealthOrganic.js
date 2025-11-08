import { ProgressBar } from "../../libs/ui/progressBar/progressBar.js";
import { createElement, methodBind } from "../../libs/index.js";
import { CardBase } from "../../card/cardBase.js";
import { ComponentHealthBase } from "./componentHealthBase.js";

export class ComponentHealthOrganic extends ComponentHealthBase {
	/** @type {HTMLDivElement} */
	#mainContainer;
	/** @type {ProgressBar} */
	#bar;

	/**
	 * @param {CardBase} host
	 * @param {{maxHealth: number}} data
	 */
	constructor(host, data) {
		super(host, data);
		methodBind(this);

		// @ts-ignore
		this.#mainContainer = createElement("div.healthDefault_c");
		this.#bar = new ProgressBar(this.#mainContainer, false);
		this.#bar.set({
			primaryColor: [255, 0, 0],
			secondaryColor: [100, 0, 0],
			value: this.current / this.maximum / 2,
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
		super.set(values);
		if (values.current != null) {
			this.#bar.set({
				value: this.current / this.maximum,
			});
		}
	}

	/**
	 * @param {number} value if negative - damage, else - healing
	 * @returns {{lethal: boolean, fullHealth: boolean}}
	 */
	modifyHealth(value) {
		this.set({
			current: this.current + value,
		});
		return {
			lethal: this.current <= 0,
			fullHealth: this.current == this.maximum,
		};
	}
}
